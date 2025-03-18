import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    FormsModule, 
    MatIcon
  ]
})
export class AdminDashboardComponent implements OnInit {
  selectedTab = 'commodities';

  // Full datasets
  allCommodities: any[] = [];
  allUsers: any[] = [];

  // Filtered data (search results)
  filteredCommodities: any[] = [];
  filteredUsers: any[] = [];

  // Paginated data (to display)
  paginatedCommodities: any[] = [];
  paginatedUsers: any[] = [];

  // Pagination properties
  pageSize: number = 10;
  commodityPage: number = 0;
  userPage: number = 0;
  totalCommodities: number = 0;
  totalUsers: number = 0;

  // Search terms
  commoditySearchTerm: string = '';
  userSearchTerm: string = '';

  constructor(private adminService: AdminService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.loadAllCommodities();
    this.loadAllUsers();
  }

  // 📌 Upload CSV file
  uploadCSV(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0]; // Correctly extracting the File object
      const formData = new FormData();
      formData.append('file', file);
  
      this.adminService.uploadCommodityCSV(formData).subscribe({
        next: () => {
          alert('Commodities uploaded successfully!');
          this.loadAllCommodities();
        },
        error: (err) => {
          alert('Error uploading CSV: ' + err.message);
        }
      });
    }
  }  

  // ─── Load complete commodities dataset ─────────────────────────────
  loadAllCommodities() {
    // Assuming adminService.getAllCommodities() returns all commodities (or simulate using a very high page size)
    this.adminService.getAllCommodities().subscribe({
      next: (data: any[]) => {
        this.allCommodities = data;
        this.totalCommodities = data.length;
        this.applyCommodityFilters();
      },
      error: (error) => {
        console.error('Error fetching commodities:', error);
      }
    });
  }

  // ─── Load complete users dataset ─────────────────────────────
  loadAllUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (data: any[]) => {
        // Exclude admins
        this.allUsers = data.filter((user: any) => user.role === 'User');
        this.totalUsers = this.allUsers.length;
        this.applyUserFilters();
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  // ─── Commodity Filtering and Pagination ─────────────────────────────
  applyCommodityFilters() {
    let filtered = [...this.allCommodities];
    if (this.commoditySearchTerm.trim()) {
      const query = this.commoditySearchTerm.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        (item.unit && item.unit.toLowerCase().includes(query)) ||
        String(item.id).includes(query) ||
        String(item.currentPrice).includes(query)
      );
    }
    this.filteredCommodities = filtered;
    this.totalCommodities = filtered.length;
    this.commodityPage = 0; // Reset to first page
    this.updatePaginatedCommodities();
  }

  updatePaginatedCommodities() {
    const start = this.commodityPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedCommodities = this.filteredCommodities.slice(start, end);
  }

  onCommodityPageChange(event: PageEvent) {
    this.commodityPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedCommodities();
  }

  searchCommodities() {
    this.applyCommodityFilters();
  }

  clearCommoditySearch() {
    this.commoditySearchTerm = '';
    this.applyCommodityFilters();
  }

  // ─── User Filtering and Pagination ─────────────────────────────
  applyUserFilters() {
    let filtered = [...this.allUsers];
    if (this.userSearchTerm.trim()) {
      const query = this.userSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        String(user.id).includes(query)
      );
    }
    this.filteredUsers = filtered;
    this.totalUsers = filtered.length;
    this.userPage = 0; // Reset to first page
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers() {
    const start = this.userPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  onUserPageChange(event: PageEvent) {
    this.userPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedUsers();
  }

  searchUsers() {
    this.applyUserFilters();
  }

  clearUserSearch() {
    this.userSearchTerm = '';
    this.applyUserFilters();
  }

  // ─── Delete handlers ─────────────────────────────
  confirmDeleteCommodity(id: number, name: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Commodity',
        message: `Are you sure you want to delete the commodity: ${name}?`
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteCommodity(id);
      }
    });
  }

  deleteCommodity(id: number) {
    this.adminService.deleteCommodity(id).subscribe({
      next: () => {
        this.loadAllCommodities();
      },
      error: (err) => {
        console.error('Error deleting commodity:', err);
      }
    });
  }

  confirmDeleteUser(id: number, username: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete the user: ${username}?`
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteUser(id);
      }
    });
  }

  deleteUser(id: number) {
    this.adminService.deleteUser(id).subscribe({
      next: () => {
        this.loadAllUsers();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      }
    });
  }

  // ─── Logout ─────────────────────────────
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/home']);
  }
}
