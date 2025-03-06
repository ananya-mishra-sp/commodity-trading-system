import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent {
  reports = [
    { name: 'Portfolio Summary', file: 'portfolio-summary.pdf' },
    { name: 'Trade History', file: 'trade-history.pdf' },
    { name: 'Risk Analysis', file: 'risk-analysis.pdf' }
  ];

  downloadReport(file: string) {
    console.log('Downloading report:', file);
  }
}
