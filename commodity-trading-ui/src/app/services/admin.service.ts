import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin'; // Update as per backend

  constructor(private http: HttpClient) {}

  // 📌 Fetch paginated commodities
  getCommodities(page: number, size: number, sort: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/commodities?page=${page}&size=${size}&sort=${sort}`);
  }

  // 📌 Upload commodities via CSV
  uploadCommodityCSV(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/commodities/upload`, formData);
  }

  // 📌 Delete a commodity
  deleteCommodity(id: number, name: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/commodities/${id}?name=${name}`);
  }

  // 📌 Fetch paginated users
  getUsers(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users?page=${page}&size=${size}`);
  }

  // 📌 Delete a user
  deleteUser(id: number, username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}?username=${username}`);
  }
}
