import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api'; // Update as per backend

  constructor(private http: HttpClient) {}

  // Fetch commodities
  getCommodities(sortBy: string = 'name', order: string = 'asc'): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/commodities?sortBy=${sortBy}&order=${order}`);
  }

  createCommodity(commodity: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/commodities`, commodity);
  }
  
  // Upload commodities via CSV
  uploadCommodityCSV(formData: FormData) {
    return this.http.post('http://localhost:8080/api/commodities/upload', formData);
  }
  

  // 📌 Delete a commodity
  deleteCommodity(id: number) {
    return this.http.delete(`${this.apiUrl}/commodities/id`, { responseType: 'text' });
  }  
  
  // Fetch users
  getUsers(): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/users`);
  }  

  createUser(user:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/auth/register`, user);
  }

  // Delete a user
  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/users/${id}`, { responseType: 'text' });
  }
  
  
}
