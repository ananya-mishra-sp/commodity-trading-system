import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router) {}

  navigateTo(page: string) {
    this.router.navigate([`/user-dashboard/${page}`]);
  }

  logout() {
    // Clear session storage/local storage or any auth token
    localStorage.removeItem('authToken'); 
    this.router.navigate(['/']);
  }
}
