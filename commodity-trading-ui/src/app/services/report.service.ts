import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  /**
   * Get the user's portfolio report
   */
  getPortfolioReport(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reports/portfolio/${userId}`);
  }

  /**
   * Get the user's risk analysis report
   */
  getRiskReport(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reports/risk/${userId}`);
  }

  // /**
  //  * Get the user's past reports from S3
  //  */
  // getPastReports(userId: number): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/reports/history/${userId}`);
  // }

  /**
   * Generate a new report for the user
   */
  // generateNewReport(userId: number): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/reports/generate/${userId}`, {});
  // }

  /**
   * Download a report file from S3
   */
  // downloadReportFile(s3Key: string): Observable<Blob> {
  //   return this.http.get(`${this.apiUrl}/reports/download/${s3Key}`, {
  //     responseType: 'blob'
  //   });
  // }
}
