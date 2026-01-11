import { Component, Inject } from '@angular/core';
import { NgFor, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PLATFORM_ID } from '@angular/core';
import { TravelService } from '../services/travel.service'; // <-- importa tu servicio

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [NgFor, CommonModule, FormsModule, TranslateModule],
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component {
  countries: any[] = [];
  cities: any[] = [];
  selectedCountry: number | null = null;
  selectedCity: number | null = null;

  constructor(
    private router: Router,
    private t: TranslateService,
    private travel: TravelService, // <-- inyecta servicio
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.t.addLangs(['es', 'de']);
    this.t.setDefaultLang('es');

    if (isPlatformBrowser(this.platformId)) {
      this.t.use(localStorage.getItem('lang') || 'es');
    } else {
      this.t.use('es'); // valor por defecto cuando está en servidor
    }
  }

  ngOnInit(): void {
    // de momento datos de prueba:
    this.countries = [
      { id: 1, nameKey: 'COUNTRIES.ENGLAND' },
      { id: 2, nameKey: 'COUNTRIES.JAPAN' },
      { id: 3, nameKey: 'COUNTRIES.INDIA' },
      { id: 4, nameKey: 'COUNTRIES.DENMARK' },
    ];
  }

  onCountryChange(countryId: number | null) {
    if (countryId == null) {
      return;
    }
    this.selectedCountry = countryId;

    // simular ciudades por país con datos completos
    if (countryId === 1) {
      this.cities = [
        {
          id: 11,
          nameKey: 'CITIES.LONDON',
          apiCity: 'London',
          code: 'GB',
          currencyCode: 'GBP',
          currencyName: 'Libra Esterlina',
          currencySymbol: '£',
          lat: 51.5072,
          lon: -0.1276,
        },
        {
          id: 12,
          nameKey: 'CITIES.MANCHESTER',
          apiCity: 'Manchester',
          code: 'GB',
          currencyCode: 'GBP',
          currencyName: 'Libra Esterlina',
          currencySymbol: '£',
          lat: 53.4808,
          lon: -2.2426,
        },
      ];
    } else if (countryId === 2) {
      this.cities = [
        {
          id: 21,
          nameKey: 'CITIES.TOKYO',
          apiCity: 'Tokyo',
          code: 'JP',
          currencyCode: 'JPY',
          currencyName: 'Yen Japonés',
          currencySymbol: '¥',
          lat: 35.6762,
          lon: 139.6503,
        },
        {
          id: 22,
          nameKey: 'CITIES.OSAKA',
          apiCity: 'Osaka',
          code: 'JP',
          currencyCode: 'JPY',
          currencyName: 'Yen Japonés',
          currencySymbol: '¥',
          lat: 34.6937,
          lon: 135.5023,
        },
      ];
    }else if (countryId === 3) {
      this.cities = [
        {id: 31,
          nameKey: 'CITIES.MUMBAI',
          apiCity: 'Mumbai',
          code: 'IN',
          currencyCode: 'INR',
          currencyName: 'Rupia India',
          currencySymbol: '₹',
          lat: 19.076,
          lon: 72.8777,
        },
        {id: 32,
          nameKey: 'CITIES.DELHI',
          apiCity: 'Delhi',
          code: 'IN',
          currencyCode: 'INR',
          currencyName: 'Rupia India',
          currencySymbol: '₹',
          lat: 28.6139,
          lon: 77.209,
        },
      ];
    }else if (countryId === 4) {
      this.cities = [
        {id: 41,
          nameKey: 'CITIES.COPENHAGUE',
          apiCity: 'Copenhagen',
          code: 'DK',
          currencyCode: 'DKK',
          currencyName: 'Corona Danesa',
          currencySymbol: 'kr',
          lat: 55.6761,
          lon: 12.5683,
        },
        {id: 42,
          nameKey: 'CITIES.AARHUS',
          apiCity: 'Aarhus',
          code: 'DK',
          currencyCode: 'DKK',
          currencyName: 'Corona Danesa',
          currencySymbol: 'kr',
          lat: 56.1629,
          lon: 10.2039,
        },
      ];
    }   
  }

  onCityChange(cityId: number | null) {
    if (cityId == null) {
      return;
    }

    this.selectedCity = cityId;
    const city = this.cities.find((c) => c.id === cityId);

    if (city) {
      // guardamos datos en el servicio
      this.travel.setSelection({
        countryId: this.selectedCountry,
        cityId: this.selectedCity,
        countryCode: city.code,
        currencyCode: city.currencyCode,
      });
      const country = this.countries.find((c) => c.id === this.selectedCountry);
      this.travel.selectedApiCity = city.apiCity;
      this.travel.selectedLat = city.lat;
      this.travel.selectedLon = city.lon;
      this.travel.selectedCountryName = country ? country.nameKey : null;
      this.travel.selectedCityName = city.nameKey;
      this.travel.selectedCurrencyName = city.currencyName;
      this.travel.selectedCurrencySymbol = city.currencySymbol;
    }
  }

  goToStep2() {
    if (this.selectedCountry && this.selectedCity) {
      this.router.navigate(['/step2']);
    } else {
      alert('Por favor seleccione país y ciudad');
    }
  }
}
