import { Component, OnInit } from '@angular/core';
import { TravelService, TravelHistoryItem } from '../services/travel.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step-history',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './history.component.html',
})
export class StepHistoryComponent implements OnInit {
  history: TravelHistoryItem[] = [];
  constructor(private travel: TravelService, private t: TranslateService, private router: Router) {}
  

  ngOnInit(): void {
    this.travel.getHistory().subscribe(res => this.history = res);

  }

    goHome() {
    this.router.navigate(['/step1']);
  }
}
