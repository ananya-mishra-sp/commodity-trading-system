import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Ensures the service is available throughout the app
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api'; // Update with your backend API

  constructor(private http: HttpClient) {}

  getPortfolio(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/portfolio/${userId}`);
  }

  getTradeHistory(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/trade-history/${userId}`);
  }

  getRiskAnalysis(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/risk-analysis/${userId}`);
  }
}

