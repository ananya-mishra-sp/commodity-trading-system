import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report.service';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  userId: number | null = null;
  portfolio: any[] = [];
  riskReports: any[] = [];
  
  displayedPortfolioColumns: string[] = ['commodity', 'quantity', 'avgBuyPrice', 'currentMarketPrice', 'portfolioValue', 'profitLoss'];
  displayedRiskColumns: string[] = ['commodity', 'portfolioValue', 'volatility', 'var95'];

  constructor(private reportsService: ReportService, private authService: AuthService) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    
    if (this.userId) {
      this.fetchPortfolio();
      this.fetchRiskReports();
    } else {
      console.error('No logged-in user found!');
    }
  }

  fetchPortfolio() {
    if (this.userId !== null) {
      this.reportsService.getPortfolio(this.userId).subscribe({
        next: (data) => (this.portfolio = data),
        error: (err) => console.error('Error fetching portfolio:', err),
      });
    }
  }
  
  fetchRiskReports() {
    if (this.userId !== null) {
      this.reportsService.getRiskReports(this.userId).subscribe({
        next: (data) => (this.riskReports = data),
        error: (err) => console.error('Error fetching risk reports:', err),
      });
    }
  }
  
}
