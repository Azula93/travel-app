import { Component } from '@angular/core';
import { NgFor } from '@angular/common'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TravelService } from '../services/travel.service';  // 👈 importar el servicio

@Component({
  selector: 'app-step2',
  imports: [NgFor, CommonModule, FormsModule, TranslateModule],
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
  standalone: true,
})


export class Step2Component {
  budgetCOP: number | null = null;
  selectedCurrency: string = 'COP';
  errorMsg: string | null = null;

    // 👇 lista de monedas para el select
  currencies = [
    { code: 'GBP', name: 'Libra Esterlina' },
    { code: 'JPY', name: 'Yen Japonés' },
    { code: 'INR', name: 'Rupia India' },
    { code: 'DKK', name: 'Corona Danesa' },
  ];

  // 👇 inyectar TravelService además del Router
  constructor(
  private router: Router,
  private travel: TravelService,
  private t: TranslateService
) {}

  backToStep1() {
    this.router.navigate(['/step1']);
  }

 saveBudget() {
  if (this.budgetCOP === null || this.budgetCOP <= 0) {
    this.errorMsg = 'Por favor ingresa un presupuesto válido';
    return;
  }

  this.travel.saveBudget(this.budgetCOP!).subscribe({
    next: res => {
      console.log('Presupuesto guardado', res);
      this.errorMsg = null;

        // actualizar el servicio
    this.travel.setBudgetCOP(this.budgetCOP!);
      // Navegar al siguiente paso
      this.router.navigate(['/step3']);
    },
    error: err => {
      if (err.status === 422) {
        // Validación del backend
        this.errorMsg = Object.values(err.error.errors).join(', ');
      } else {
        this.errorMsg = 'Error al guardar el presupuesto';
      }
    }
  });
}


}
