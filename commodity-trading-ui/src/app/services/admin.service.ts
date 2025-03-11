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
  deleteCommodity(id: number, name: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/commodities/${id}?name=${name}`);
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
  deleteUser(id: number, username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}?username=${username}`);
  }
}
