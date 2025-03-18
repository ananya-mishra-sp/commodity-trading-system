import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
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
    MatDialogModule
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  displayedPortfolioColumns: string[] = ['commodity', 'quantity', 'avgBuyPrice', 'currentMarketPrice', 'portfolioValue', 'profitLoss'];
  displayedRiskColumns: string[] = ['commodity', 'portfolioValue', 'volatility', 'var95'];
  
  portfolio: any[] = [];
  riskReports: any[] = [];
  userId: number | null = null;
  pastReports: any[] = [];

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
        },
        error: (err) => {
          console.error('Error fetching portfolio report:', err);
        }
      });

      this.reportService.getRiskReport(this.userId).subscribe({
        next: (data) => {
          this.riskReports = data;
        },
        error: (err) => {
          console.error('Error fetching risk report:', err);
        }
      });
    }
  }

  // loadPastReports() {
  //   if (this.userId !== null) {
  //     this.reportService.getPastReports(this.userId).subscribe({
  //       next: (reports) => {
  //         this.pastReports = reports.slice(0, 5); // Get the latest 5 reports
  //       },
  //       error: (err) => {
  //         console.error('Error fetching past reports:', err);
  //       }
  //     });
  //   }
  // }

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

  // viewReportHistory() {
  //   this.dialog.open(ReportHistoryDialogComponent, {
  //     width: '800px',
  //     data: {
  //       pastReports: this.pastReports,
  //       userId: this.userId
  //     }
  //   });
  // }
}