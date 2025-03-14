import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:8080/api/reports';

  constructor(private http: HttpClient) {}

  getPortfolio(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/portfolio/${userId}`);
  }

  getRiskReports(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/risk/${userId}`);
  }
}
