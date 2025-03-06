import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
  imports: [CommonModule],
})
export class UserDashboardComponent implements OnInit {
  userId: number = 1;
  portfolio: any[] = []; // ✅ Added this
  trades: any[] = []; // ✅ Added this
  riskAnalysis: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUserPortfolio();
    this.loadTradeHistory();
    this.loadRiskAnalysis();
  }

  loadUserPortfolio() {
    this.apiService.getPortfolio(this.userId).subscribe({
      next: (data) => {
        this.portfolio = data; // ✅ Assign the data properly
      },
      error: (err) => {
        console.error('Error fetching portfolio:', err);
      }
    });
  }

  loadTradeHistory() {
    this.apiService.getTradeHistory(this.userId).subscribe({
      next: (data) => {
        this.trades = data; // ✅ Assign the data properly
      },
      error: (err) => {
        console.error('Error fetching trade history:', err);
      }
    });
  }

  loadRiskAnalysis() {
    this.apiService.getRiskAnalysis(this.userId).subscribe({
      next: (data) => {
        this.riskAnalysis = data;
      },
      error: (err) => {
        console.error('Error fetching risk analysis:', err);
      }
    });
  }
}
