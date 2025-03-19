import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api/commodities'; // Change URL as per your backend

  constructor(private http: HttpClient) {}

  // Fetch commodities from backend
  getCommodities(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
