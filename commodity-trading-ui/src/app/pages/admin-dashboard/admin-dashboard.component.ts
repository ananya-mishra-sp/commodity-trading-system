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
import { NgIf} from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';

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
  totalUsers = 0;

  constructor(private adminService: AdminService, public dialog: MatDialog, private router: Router) {}

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

  confirmDeleteCommodity(id: number, name: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Commodity',
        message: `Are you sure you want to delete the commodity: ${name}?`,
      },
    });
  
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteCommodity(id);
      }
    });
  }
  
  confirmDeleteUser(id: number, username: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete the user: ${username}?`,
      },
    });
  
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteUser(id);
      }
    });
  }  

  showMessageDialog(title: string, message: string) {
    this.dialog.open(ConfirmationDialogComponent, {
      data: { title, message },
    });
  }  

  // 📌 Delete commodity
  deleteCommodity(id: number) {
    this.adminService.deleteCommodity(id).subscribe({
      next: () => {
        this.showMessageDialog('Success', 'Commodity deleted successfully!');
        this.loadCommodities();
      },
      error: (err) => {
        this.showMessageDialog('Error', 'Error deleting commodity: ' + err.message);
      },
    });
  }
  
  deleteUser(id: number) {
    this.adminService.deleteUser(id).subscribe({
      next: () => {
        this.showMessageDialog('Success', 'User deleted successfully!');
        this.loadUsers();
      },
      error: (err) => {
        this.showMessageDialog('Error', 'Error deleting user: ' + err.message);
      },
    });
  }  

  // 📌 Logout
  logout() {
    localStorage.clear();  // Clear any stored tokens or data
    sessionStorage.clear();  // Clear session storage

    this.router.navigate(['/home']);  // Redirect to landing page
  }  
}
