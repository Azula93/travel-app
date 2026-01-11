import { Component, OnInit, Inject } from '@angular/core';
import { NgFor, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PLATFORM_ID } from '@angular/core';
import { TravelService, ConvertResponse, TravelHistoryItem } from '../services/travel.service';
import { Observable, OperatorFunction } from 'rxjs';

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit {
  countryName: string | null = null;
  cityName: string | null = null;
  budgetCOP: number | null = null;
  currencyName: string | null = null;
  currencySymbol: string | null = null;

  originalAmount: number | null = null;
  convertedAmount: number | null = null;
  exchangeRate: number | null = null;
  toCurrency: string = 'USD';
  loading = true;

  // Datos del clima mejorados
  weatherData: any = null;
  weatherError: string | null = null;

  constructor(
    private router: Router,
    private travel: TravelService,
    private t: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadSelection();
  }

// Cargar selección guardada
  private loadSelection() {
    this.countryName = this.travel.getCountryName();
    this.cityName = this.travel.getCityName();

    if (this.countryName) this.translateKey('country', this.countryName);
    if (this.cityName) this.translateKey('city', this.cityName);

    this.currencyName = this.travel.getCurrencyName();
    this.currencySymbol = this.travel.getCurrencySymbol();
    this.originalAmount = this.travel.getBudgetCOP();
    this.toCurrency = this.travel.getToCurrency() ?? 'USD';

    if (!this.originalAmount) {
      this.showAlert('No hay presupuesto guardado, vuelve al paso 2');
      this.router.navigate(['/step2']);
      return;
    }

    this.getCurrencyConversion();
    this.fetchWeather();
  }

  // Traduce el nombre del país o ciudad
  private translateKey(type: 'country' | 'city', key: string) {
    this.t.get(key).subscribe((translated) => {
      if (type === 'country') this.countryName = translated;
      else this.cityName = translated;
    });
  }

  // Obtener conversión de moneda
   private getCurrencyConversion() {
    if (!this.originalAmount || !this.travel.selectedCountryName || !this.travel.selectedCityName || !this.currencySymbol) {
      this.showAlert('Datos incompletos para la conversión');
      this.loading = false;
      return;
    }

    this.travel.getCurrencyConversion('COP', this.toCurrency, this.originalAmount)
      .subscribe({
        next: (res: any) => {
          if (!res.success) {
            const msg = res.error?.info ?? 'Error desconocido en la API';
            this.showAlert('No se pudo obtener la conversión: ' + msg);
            this.loading = false;
            return;
          }

           this.convertedAmount = res.converted_amount ?? null;
        this.exchangeRate = res.rate ?? null;

          
          const historyItem: TravelHistoryItem = {
            countryKey: this.travel.selectedCountryName!,
            cityKey: this.travel.selectedCityName!,
            originalAmount: this.originalAmount!,
            convertedAmount: this.convertedAmount!,
            currencySymbol: this.currencySymbol!,
           
          };

          this.travel.addToHistory(historyItem).subscribe({
            next: () => console.log('Conversión y historial guardados con éxito'),
            error: (err) => console.error('Error guardando historial', err),
            complete: () => this.loading = false
          });
        },
        error: (err) => {
          console.error('Error en conversión', err);
          let errorMessage = 'No se pudo obtener la conversión';
          if (err.error?.error) errorMessage = err.error.error;
          this.showAlert(errorMessage);
          this.loading = false;
        }
      });
  }


  // Obtener datos del clima
  private fetchWeather() {
    const apiCity = this.travel.selectedApiCity;
    if (!apiCity) {
      this.weatherError = 'No se ha seleccionado una ciudad válida';
      this.loading = false;
      return;
    }

    this.travel.getWeatherByCity(apiCity).subscribe({
      next: (data: any) => {
        if (data && data.success) {
          this.weatherData = data.data;
          this.weatherError = null;
        } else {
          this.weatherError = 'No se pudieron obtener los datos del clima';
          console.error('Respuesta inesperada de la API:', data);
        }
      },
      error: (err) => {
        console.error('Error clima', err);
        this.weatherError = 'Error al obtener el clima';
        if (err.error && err.error.error) {
          this.weatherError += ': ' + err.error.error;
        }
      },
    });
  }

  // Obtener icono del clima basado en el código de OpenWeather
  getWeatherIcon(iconCode: string): string {
    const iconMap: {[key: string]: string} = {
      '01d': 'fa-sun',
      '01n': 'fa-moon',
      '02d': 'fa-cloud-sun',
      '02n': 'fa-cloud-moon',
      '03d': 'fa-cloud',
      '03n': 'fa-cloud',
      '04d': 'fa-cloud',
      '04n': 'fa-cloud',
      '09d': 'fa-cloud-rain',
      '09n': 'fa-cloud-rain',
      '10d': 'fa-cloud-sun-rain',
      '10n': 'fa-cloud-moon-rain',
      '11d': 'fa-bolt',
      '11n': 'fa-bolt',
      '13d': 'fa-snowflake',
      '13n': 'fa-snowflake',
      '50d': 'fa-smog',
      '50n': 'fa-smog'
    };
    
    return iconMap[iconCode] || 'fa-cloud';
  }

  // Hora en Colombia
  private getColombiaTime(date: Date): Date {
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const colombiaOffset = -5 * 60; // UTC-5 en minutos
    return new Date(utc + colombiaOffset * 60000);
  }


  private showAlert(msg: string) {
    if (isPlatformBrowser(this.platformId)) alert(msg);
    else console.log('ALERTA:', msg);
  }

  // Navegar al inicio
  goHome() {
    this.router.navigate(['/step1']);
  }
}




