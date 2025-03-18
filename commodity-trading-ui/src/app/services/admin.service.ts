import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin'; // Update as per backend

  constructor(private http: HttpClient) {}

  // 📌 Fetch paginated commodities
  getCommodities(page: number, size: number, sortBy: string = 'name', order: string = 'asc'): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/admin/commodities`, {
      params: {
        page: page.toString(),
        size: size.toString(),
        sortBy: sortBy,
        order: order
      }
    });
  }
  

  // 📌 Upload commodities via CSV
  uploadCommodityCSV(formData: FormData) {
    return this.http.post('http://localhost:8080/api/commodities/upload', formData);
  }
  

  // 📌 Delete a commodity
  deleteCommodity(id: number) {
    return this.http.delete(`${this.apiUrl}/commodities/${id}`, { responseType: 'text' });
  }  
  
  // 📌 Fetch paginated users
  getUsers(page: number, size: number, sortBy: string = 'name', order: string = 'asc'): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/admin/users`, {
      params: {
        page: page.toString(),
        size: size.toString(),
        sortBy: sortBy,
        order: order
      }
    });
  }  

  // 📌 Delete a user
  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/users/${id}`, { responseType: 'text' });
  }

  getAllCommodities(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/commodities`, {
      params: { page: '0', size: '1000', sortBy: 'name', order: 'asc' }
    }).pipe(map(response => response.content));
  }
  
  getAllUsers(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/users`, {
      params: { page: '0', size: '1000', sortBy: 'name', order: 'asc' }
    }).pipe(map(response => response.content));
  }  
  
}
