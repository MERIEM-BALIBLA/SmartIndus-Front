import { Component } from '@angular/core';

@Component({
  selector: 'app-statistic',
  imports: [],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.css'
})
export class StatisticComponent {
  statistics = {
    users: {
      total: 1254,
      growth: 12,
      growthPositive: true
    },
    products: {
      total: 152,
      growth: 8,
      growthPositive: true
    },
    orders: {
      total: 48,
      growth: 3,
      growthPositive: false
    },
    revenue: {
      total: '€6,250',
      growth: 10,
      growthPositive: true
    }
  };
}
