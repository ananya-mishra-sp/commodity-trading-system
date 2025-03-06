// src/app/pages/admin-dashboard/admin-dashboard.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  constructor(private router: Router) {}

  uploadCSV() {
    alert('Upload feature coming soon!');
  }

  logout() {
    this.router.navigate(['/']);
  }
}
