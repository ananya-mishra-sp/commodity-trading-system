import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { ReportHistoryDialogComponent } from '../../components/report-history-dialog/report-history-dialog.component';
import { ReportService } from '../../services/report.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatSortModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,
    MatTabsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    FormsModule
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  displayedPortfolioColumns: string[] = ['commodity', 'quantity', 'avgBuyPrice', 'currentMarketPrice', 'portfolioValue', 'profitLoss'];
  displayedRiskColumns: string[] = ['commodity', 'portfolioValue', 'volatility', 'var95'];
  
  // Original data
  portfolio: any[] = [];
  riskReports: any[] = [];
  
  // Filtered and paginated data
  filteredPortfolio: any[] = [];
  filteredRiskReports: any[] = [];
  displayedPortfolio: any[] = [];
  displayedRiskReports: any[] = [];
  
  userId: number | null = null;
  pastReports: any[] = [];
  
  // Pagination settings
  portfolioPageSize = 5;
  portfolioPageIndex = 0;
  riskPageSize = 5;
  riskPageIndex = 0;
  
  // View mode
  portfolioViewMode = 'table';
  riskViewMode = 'table';
  
  // Search
  portfolioSearchTerm = '';
  riskSearchTerm = '';

  constructor(
    private reportService: ReportService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    
    if (this.userId !== null) {
      this.loadReports();
    } else {
      console.error('No logged-in user found!');
    }
  }

  loadReports() {
    if (this.userId !== null) {
      this.reportService.getPortfolioReport(this.userId).subscribe({
        next: (data) => {
          this.portfolio = data;
          this.applyPortfolioFilter();
        },
        error: (err) => {
          console.error('Error fetching portfolio report:', err);
        }
      });

      this.reportService.getRiskReport(this.userId).subscribe({
        next: (data) => {
          this.riskReports = data;
          this.applyRiskFilter();
        },
        error: (err) => {
          console.error('Error fetching risk report:', err);
        }
      });
    }
  }

  // Search and filter functions
  applyPortfolioFilter() {
    const searchTerm = this.portfolioSearchTerm.toLowerCase();
    this.filteredPortfolio = this.portfolio.filter(item => 
      item.commodity.name.toLowerCase().includes(searchTerm)
    );
    this.updatePortfolioPage();
  }

  applyRiskFilter() {
    const searchTerm = this.riskSearchTerm.toLowerCase();
    this.filteredRiskReports = this.riskReports.filter(item => 
      item.commodity.name.toLowerCase().includes(searchTerm)
    );
    this.updateRiskPage();
  }

  // Pagination handlers
  onPortfolioPageChange(event: PageEvent) {
    this.portfolioPageSize = event.pageSize;
    this.portfolioPageIndex = event.pageIndex;
    this.updatePortfolioPage();
  }

  onRiskPageChange(event: PageEvent) {
    this.riskPageSize = event.pageSize;
    this.riskPageIndex = event.pageIndex;
    this.updateRiskPage();
  }

  updatePortfolioPage() {
    const startIndex = this.portfolioPageIndex * this.portfolioPageSize;
    this.displayedPortfolio = this.filteredPortfolio.slice(startIndex, startIndex + this.portfolioPageSize);
  }

  updateRiskPage() {
    const startIndex = this.riskPageIndex * this.riskPageSize;
    this.displayedRiskReports = this.filteredRiskReports.slice(startIndex, startIndex + this.riskPageSize);
  }

  // Sorting handlers
  sortPortfolioData(sort: Sort) {
    const data = this.filteredPortfolio.slice();
    if (!sort.active || sort.direction === '') {
      this.filteredPortfolio = data;
    } else {
      this.filteredPortfolio = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'commodity': return this.compare(a.commodity.name, b.commodity.name, isAsc);
          case 'quantity': return this.compare(a.totalQuantity, b.totalQuantity, isAsc);
          case 'avgBuyPrice': return this.compare(a.avgBuyPrice, b.avgBuyPrice, isAsc);
          case 'currentMarketPrice': return this.compare(a.currentMarketPrice, b.currentMarketPrice, isAsc);
          case 'portfolioValue': return this.compare(a.portfolioValue, b.portfolioValue, isAsc);
          case 'profitLoss': return this.compare(a.profitLoss, b.profitLoss, isAsc);
          default: return 0;
        }
      });
    }
    this.updatePortfolioPage();
  }

  sortRiskData(sort: Sort) {
    const data = this.filteredRiskReports.slice();
    if (!sort.active || sort.direction === '') {
      this.filteredRiskReports = data;
    } else {
      this.filteredRiskReports = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'commodity': return this.compare(a.commodity.name, b.commodity.name, isAsc);
          case 'portfolioValue': return this.compare(a.portfolioValue, b.portfolioValue, isAsc);
          case 'volatility': return this.compare(a.volatility, b.volatility, isAsc);
          case 'var95': return this.compare(a.var95, b.var95, isAsc);
          default: return 0;
        }
      });
    }
    this.updateRiskPage();
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // Search handlers
  onPortfolioSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.portfolioSearchTerm = target.value;
    this.portfolioPageIndex = 0; // Reset to first page
    this.applyPortfolioFilter();
  }

  onRiskSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.riskSearchTerm = target.value;
    this.riskPageIndex = 0; // Reset to first page
    this.applyRiskFilter();
  }

  // View mode toggle
  togglePortfolioView(viewMode: string) {
    this.portfolioViewMode = viewMode;
  }

  toggleRiskView(viewMode: string) {
    this.riskViewMode = viewMode;
  }

  // Export functions
  downloadPortfolioReport() {
    this.exportTableToCsv(this.portfolio, this.displayedPortfolioColumns, 'portfolio-report');
  }

  downloadRiskReport() {
    this.exportTableToCsv(this.riskReports, this.displayedRiskColumns, 'risk-analysis-report');
  }

  exportTableToCsv(data: any[], columns: string[], filename: string) {
    // Create column headers with proper formatting
    const headers = columns.map(col => {
      return this.formatColumnHeader(col);
    });

    const csvRows = [
      headers.join(','),
      ...data.map(row => {
        return columns.map(col => {
          let value = row[col];
          
          // Format specific column types
          if (col === 'commodity') {
            value = row.commodity.name;
          } else if (col === 'quantity') {
            value = row.totalQuantity; // Ensure quantity is included
          } else if (col === 'profitLoss' || col === 'portfolioValue' || col === 'avgBuyPrice' || col === 'currentMarketPrice') {
            value = this.formatCurrency(value);
          } else if (col === 'volatility' || col === 'var95') {
            value = this.formatPercentage(value);
          }
          
          // Escape quotes and wrap text values in quotes
          if (typeof value === 'string') {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          
          return value;
        }).join(',');
      })
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    window.URL.revokeObjectURL(url);
  }

  formatColumnHeader(column: string): string {
    // Convert camelCase to Title Case with spaces
    return column
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }

  formatCurrency(value: number): string {
    return value.toFixed(2);
  }

  formatPercentage(value: number): string {
    return (value * 100).toFixed(2);
  }

  // Calculate profit/loss percentage
  calculateProfitLossPercentage(element: any): string {
    const percentage = (element.profitLoss / (element.portfolioValue - element.profitLoss)) * 100;
    return percentage.toFixed(2) + '%';
  }

  // Get color based on profit/loss
  getProfitLossColor(value: number): string {
    return value >= 0 ? 'green' : 'red';
  }
}