import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-report-history-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  template: `
    <h2 mat-dialog-title>Past Reports</h2>
    <div mat-dialog-content>
      <mat-list>
        <mat-list-item *ngFor="let report of data.pastReports">
          <div class="report-item">
            <div>
              <span>{{ report.reportDate | date:'medium' }}</span>
              <span class="report-type">{{ report.reportType }}</span>
            </div>
            <div class="report-actions">
              <!-- <button mat-icon-button color="primary" (click)="downloadReport(report)">
                <mat-icon>download</mat-icon>
              </button> -->
              <button mat-icon-button color="accent" (click)="viewReport(report)">
                <mat-icon>visibility</mat-icon>
              </button>
            </div>
          </div>
        </mat-list-item>
      </mat-list>
      
      <div *ngIf="data.pastReports.length === 0" class="no-reports">
        No past reports available
      </div>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </div>
  `,
  styles: [`
    .report-item {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
    }
    
    .report-type {
      margin-left: 16px;
      padding: 2px 8px;
      background-color: #7a0000;
      color: white;
      border-radius: 4px;
      font-size: 12px;
    }
    
    .report-actions {
      display: flex;
    }
    
    .no-reports {
      padding: 20px;
      text-align: center;
      color: #888;
    }
  `]
})
export class ReportHistoryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ReportHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private reportService: ReportService
  ) {}

  // downloadReport(report: any) {
  //   this.reportService.downloadReportFile(report.s3Key).subscribe({
  //     next: (blob) => {
  //       const url = window.URL.createObjectURL(blob);
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.download = `${report.reportType}-${report.reportDate}.csv`;
  //       link.click();
  //       window.URL.revokeObjectURL(url);
  //     },
  //     error: (err) => {
  //       console.error('Error downloading report:', err);
  //     }
  //   });
  // }

  viewReport(report: any) {
    // Your implementation to view the report
    // Could open another dialog or navigate to a report viewer page
  }
}
