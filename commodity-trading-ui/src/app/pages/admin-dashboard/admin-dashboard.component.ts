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

  constructor(private adminService: AdminService, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadCommodities();
    this.loadUsers();
  }

  // 📌 Fetch commodities with pagination and sorting
  loadCommodities() {
    this.adminService.getCommodities(this.commodityPage, this.pageSize, this.selectedSort)
      .subscribe((data) => {
        this.commodities = data.content;
      });
  }

  // 📌 Upload CSV file
  uploadCSV(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.adminService.uploadCommodityCSV(file).subscribe(() => {
        alert('Commodities uploaded successfully!');
        this.loadCommodities();
      });
    }
  }

  // 📌 Fetch users with pagination
  loadUsers() {
    this.adminService.getUsers(this.userPage, this.pageSize).subscribe((data) => {
      this.users = data.content;
    });
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
    alert('Logging out...');
    // Implement actual logout logic here
  }
}
