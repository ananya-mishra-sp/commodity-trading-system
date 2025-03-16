import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Base API URL

  constructor(private http: HttpClient, private router: Router) {} // Inject Router

  // Login method - expects a structured response with role
  login(credentials: { username: string; password: string }): Observable<{ userId: number; role: string }> {
    return this.http.post<{ userId: number; role: string }>(`${this.apiUrl}/login`, credentials);
  }
  
  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    this.router.navigate(['/']); // Redirect to the home page after logout
  }

  // Register method
  register(userData: { name: string; username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, { responseType: 'text' });
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  // Check if username exists
  checkUsername(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-username/${username}`);
  }

  // Check if email exists
  checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email/${email}`);
  }
}
