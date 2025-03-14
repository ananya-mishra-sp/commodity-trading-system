import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report.service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  userId = 1; // Replace with logged-in user ID when authentication is implemented
  portfolio: any[] = [];
  riskReports: any[] = [];
  
  displayedPortfolioColumns: string[] = ['commodity', 'quantity', 'avgBuyPrice', 'currentMarketPrice', 'portfolioValue', 'profitLoss'];
  displayedRiskColumns: string[] = ['commodity', 'portfolioValue', 'volatility', 'var95'];

  constructor(private reportsService: ReportService) {}

  ngOnInit() {
    this.fetchPortfolio();
    this.fetchRiskReports();
  }

  fetchPortfolio() {
    this.reportsService.getPortfolio(this.userId).subscribe({
      next: (data) => (this.portfolio = data),
      error: (err) => console.error('Error fetching portfolio:', err),
    });
  }

  fetchRiskReports() {
    this.reportsService.getRiskReports(this.userId).subscribe({
      next: (data) => (this.riskReports = data),
      error: (err) => console.error('Error fetching risk reports:', err),
    });
  }
}
