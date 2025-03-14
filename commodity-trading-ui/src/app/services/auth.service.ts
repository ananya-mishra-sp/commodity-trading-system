import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: { fullName: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  checkUsername(username: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/auth/check-username?username=${username}`);
  }
  
  checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/auth/check-email?email=${email}`);
  }
  
}
