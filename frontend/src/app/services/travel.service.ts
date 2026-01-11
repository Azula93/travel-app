// src/app/services/travel.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConvertResponse {
  success: boolean;
  rate: number;
  converted_amount: number;
  from: string;
  to: string;
  amount: number;
  query?: { from: string; to: string; amount: number };
  info?: { rate: number };
  result?: number;
  error?: string;
}

export interface TravelHistoryItem {
  countryKey: string;
  cityKey: string;
  originalAmount: number;
  convertedAmount: number;
  currencySymbol: string;
  date?: Date;
}

@Injectable({ providedIn: 'root' })
export class TravelService {
  private apiUrl = 'http://localhost:8000/api'; // URL de Laravel

  // datos seleccionados
  public selectedCountryId: number | null = null;
  public selectedCityId: number | null = null;
  public selectedCountryCode: string | null = null;
  public selectedCurrencyCode: string | null = null;
  public budgetCOP: number | null = null;
  public selectedCountryName: string | null = null;
  public selectedCityName: string | null = null;
  public selectedCurrencyName: string | null = null;
  public selectedCurrencySymbol: string | null = null;
  public selectedLat: number | null = null;
  public selectedLon: number | null = null;
  public selectedApiCity: string | null = null;

  constructor(private http: HttpClient) {}

  addToHistory(item: TravelHistoryItem): Observable<TravelHistoryItem> {
    return this.http.post<TravelHistoryItem>(`${this.apiUrl}/history`, item);
  }

  getHistory(): Observable<TravelHistoryItem[]> {
    return this.http.get<TravelHistoryItem[]>(`${this.apiUrl}/history`);
  }
  // Guardar selección básica
  setSelection(opts: {
    countryId?: number | null;
    cityId?: number | null;
    countryCode?: string | null;
    currencyCode?: string | null;
    countryName?: string | null;
    cityName?: string | null;
    currencyName?: string | null;
    currencySymbol?: string | null;
  }) {
    if (opts.countryId !== undefined)
      this.selectedCountryId = opts.countryId ?? null;
    if (opts.cityId !== undefined) this.selectedCityId = opts.cityId ?? null;
    if (opts.countryCode !== undefined)
      this.selectedCountryCode = opts.countryCode ?? null;
    if (opts.currencyCode !== undefined)
      this.selectedCurrencyCode = opts.currencyCode ?? null;

    if (opts.countryName !== undefined)
      this.selectedCountryName = opts.countryName ?? null;
    if (opts.cityName !== undefined)
      this.selectedCityName = opts.cityName ?? null;
    if (opts.currencyName !== undefined)
      this.selectedCurrencyName = opts.currencyName ?? null;
    if (opts.currencySymbol !== undefined)
      this.selectedCurrencySymbol = opts.currencySymbol ?? null;
  }

  setBudgetCOP(amount: number | null) {
    this.budgetCOP = amount ?? null;
  }

  getBudgetCOP(): number | null {
    return this.budgetCOP;
  }

  // === Moneda destino ===
  setToCurrency(code: string | null) {
    this.selectedCurrencyCode = code;
  }

  getToCurrency(): string | null {
    return this.selectedCurrencyCode;
  }

  // getters
  getCountryName(): string | null {
    return this.selectedCountryName;
  }
  getCityName(): string | null {
    return this.selectedCityName;
  }
  getCurrencyName(): string | null {
    return this.selectedCurrencyName;
  }
  getCurrencySymbol(): string | null {
    return this.selectedCurrencySymbol;
  }

  // Método para obtener la conversión de moneda desde el backend
  getCurrencyConversion(
    from: string,
    to: string,
    amount: number
  ): Observable<ConvertResponse> {
    return this.http.get<ConvertResponse>(
      `${this.apiUrl}/convert?from=${from}&to=${to}&amount=${amount}`
    );
  }

  // Método para obtener clima por ciudad
  getWeatherByCity(cityName: string): Observable<any> {
    return this.http.get<any>(
      `http://localhost:8000/api/weather?city=${encodeURIComponent(cityName)}`
    );
  }

  // guardar presupuesto en backend
  saveBudget(budget: number) {
    return this.http.post('http://localhost:8000/api/save-budget', {
      budgetCOP: budget,
    });
  }
}
