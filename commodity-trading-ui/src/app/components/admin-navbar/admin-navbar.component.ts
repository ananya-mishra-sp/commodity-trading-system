import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  template: `
    <div class="navbar">
      <div class="logo">
        <a href="/admin">
          <span>Commodity Trading</span>
          <span class="dashboard-title">Admin Dashboard</span>
        </a>
      </div>
      <div class="nav-buttons">
        <button class="nav-btn" [class.active]="activeTab === 'commodities'" (click)="navigateTo('commodities')">
          <mat-icon>shopping_basket</mat-icon>
          Manage Commodities
        </button>
        <button class="nav-btn" [class.active]="activeTab === 'users'" (click)="navigateTo('users')">
          <mat-icon>people</mat-icon>
          Manage Users
        </button>
        <button class="nav-btn logout-btn" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {
  @Input() activeTab: string = 'commodities';
  @Output() tabChange = new EventEmitter<string>();
  @Output() logoutRequest = new EventEmitter<void>();

  constructor(private router: Router) {
    // Get current active tab from URL on initialization
    const queryParams = new URLSearchParams(window.location.search);
    const tab = queryParams.get('tab');
    if (tab) {
      this.activeTab = tab;
    }
  }

  navigateTo(tab: string): void {
    this.activeTab = tab;
    this.tabChange.emit(tab);
    // Let the parent component handle the navigation
    // This ensures we're using the same navigation logic as in the dashboard
  }

  logout(): void {
    this.logoutRequest.emit();
    // Let the parent component handle the logout
    // This ensures we're using the same logout logic as in the dashboard
  }
}