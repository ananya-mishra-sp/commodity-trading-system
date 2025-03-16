// import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../components/delete-popup/delete-popup.component';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

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
    NgIf
  ]
})
export class AdminDashboardComponent {
  selectedTab = 'commodities'; // Default tab
  commodities: any[] = [];
  users: any[] = [];
  selectedSort = 'name-asc';
  pageSize = 10;
  commodityPage = 0;
  userPage = 0;
  totalItems = 0;
  totalUsers = 0
  router: any;

  constructor(private adminService: AdminService, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadCommodities();
    this.loadUsers();
  }

  // 📌 Fetch commodities with pagination and sorting
  loadCommodities() {
    this.adminService.getCommodities(this.commodityPage, this.pageSize).subscribe({
      next: (response) => {
        this.commodities = response.content;  // Extract commodities list from the response
        this.totalItems = response.totalElements;  // Set total elements for pagination
      },
      error: (error) => {
        console.error('Error fetching commodities:', error);
      }
    });
  }

  onPageChange(event: any) {
    this.commodityPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCommodities();
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
          this.loadCommodities();
        },
        error: (err) => {
          alert('Error uploading CSV: ' + err.message);
        }
      });
    }
  }  

  // 📌 Fetch users with pagination
  loadUsers() {
    this.adminService.getUsers(this.userPage, this.pageSize).subscribe({
      next: (response) => {
        // Filter users to exclude Admins
        this.users = response.content.filter((user: { role: string; }) => user.role === 'User');  
        this.totalUsers = this.users.length;  // Adjust total count based on filtered users
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  onUserPageChange(event: any) {
    this.userPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  // 📌 Open delete popup
  openDeletePopup(type: 'commodity' | 'user') {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '400px',
      data: { type },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        type === 'commodity' ? this.deleteCommodity(result.id, result.name) : this.deleteUser(result.id, result.name);
      }
    });
  }

  // 📌 Delete commodity
  deleteCommodity(id: number, name: string) {
    this.adminService.deleteCommodity(id, name).subscribe(() => {
      alert('Commodity deleted successfully!');
      this.loadCommodities();
    });
  }

  // 📌 Delete user
  deleteUser(id: number, username: string) {
    this.adminService.deleteUser(id, username).subscribe(() => {
      alert('User deleted successfully!');
      this.loadUsers();
    });
  }

  // 📌 Logout
  logout() {
    localStorage.clear();  // Clear any stored tokens or data
    sessionStorage.clear();  // Clear session storage
    alert('Logging out...');
    this.router.navigate(['/home']);  // Redirect to landing page
  }  
}
