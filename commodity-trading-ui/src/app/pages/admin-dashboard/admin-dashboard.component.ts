import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AddCommodityDialogComponent } from '../../components/add-commodity-dialog/add-commodity-dialog.component';
import { AddUserDialogComponent } from '../../components/add-user-dialog/add-user-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminNavbarComponent } from '../../components/admin-navbar/admin-navbar.component';
import { DeletePopupComponent } from '../../components/delete-popup/delete-popup.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

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
    MatIconModule,
    MatSortModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    AdminNavbarComponent
]
})
export class AdminDashboardComponent implements OnInit {
  selectedTab = 'commodities';

  // Commodities data
  allCommodities: any[] = [];
  filteredCommodities: any[] = [];
  commoditiesDataSource = new MatTableDataSource<any>([]);
  commodityColumns: string[] = ['id', 'name', 'unit', 'price', 'actions'];

  // Users data
  allUsers: any[] = [];
  filteredUsers: any[] = [];
  usersDataSource = new MatTableDataSource<any>([]);
  userColumns: string[] = ['id', 'name', 'username', 'email', 'actions'];

  // Pagination properties
  commodityPageSize = 200;
  commodityPageIndex = 0;
  userPageSize = 200;
  userPageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];

  // Total items counts
  totalCommodities = 0;
  totalUsers = 0;

// Sorting
commoditySortActive = 'name';
commoditySortDirection: 'asc' | 'desc' = 'asc';
userSortActive = 'name';
userSortDirection: 'asc' | 'desc' = 'asc';

  // Search terms
  commoditySearchTerm = '';
  userSearchTerm = '';

  @ViewChild('commodityPaginator') commodityPaginator!: MatPaginator;
  @ViewChild('userPaginator') userPaginator!: MatPaginator;

  @ViewChild('commoditySort') commoditySort!: MatSort;
  @ViewChild('userSort') userSort!: MatSort;
  
  constructor(
    private adminService: AdminService, 
    public dialog: MatDialog, 
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Check for tab parameter in URL
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.selectedTab = params['tab'];
      }
    });

    this.loadCommodities();
    this.loadUsers();
  }

  ngAfterViewInit() {
  this.commoditiesDataSource.paginator = this.commodityPaginator;
  this.commoditiesDataSource.sort = this.commoditySort;

  this.usersDataSource.paginator = this.userPaginator;
  this.usersDataSource.sort = this.userSort;
}

  openAddCommodityDialog(): void {
    const dialogRef = this.dialog.open(AddCommodityDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCommodities();
        this.showNotification('Commodity added successfully', 'success');
      }
    });
  }

  confirmDeleteCommodity(id: number, name: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Commodity',
        message: `Are you sure you want to delete ${name}?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteCommodity(id, name);
      }
    });
  }

  deleteCommodity(id: number, name: string): void {
    this.adminService.deleteCommodity(id).subscribe({
      next: () => {
        this.showNotification(`Commodity "${name}" deleted successfully`, 'success');
        this.loadCommodities();
      },
      error: (error) => {
        console.error('Error deleting commodity:', error);
        this.showNotification(`Failed to delete commodity "${name}"`, 'error');
      }
    });
  }

 // Load Commodities - Fetch Once & Use Local Pagination/Search
 loadCommodities(): void {
  this.adminService.getCommodities().subscribe({
    next: (commodities) => {
      this.allCommodities = commodities;
      this.applyFilterCommodities();
    },
    error: (error) => {
      console.error('Error loading commodities:', error);
      this.showNotification('Failed to load commodities', 'error');
    }
  });
}

// Load Users - Fetch Once & Use Local Pagination/Search
loadUsers(): void {
  this.adminService.getUsers().subscribe({
    next: (users) => {
      this.allUsers = users.filter((user: any) => user.role === 'User');
      this.applyFilterUsers();
    },
    error: (error) => {
      console.error('Error loading users:', error);
      this.showNotification('Failed to load users', 'error');
    }
  });
}

// Apply Search & Pagination for Commodities
applyFilterCommodities(): void {
  let filteredData = this.allCommodities.filter(commodity =>
    commodity.name.toLowerCase().includes(this.commoditySearchTerm.toLowerCase())
  );
  this.applySort(filteredData, this.commoditySortActive, this.commoditySortDirection);
  this.paginateCommodities(filteredData);
}

paginateCommodities(filteredData: any[]): void {
  const start = this.commodityPageIndex * this.commodityPageSize;
  const end = start + this.commodityPageSize;
  this.commoditiesDataSource.data = filteredData.slice(start, end);
}

onCommoditySortChange(sort: Sort): void {
  this.commoditySortActive = sort.active;
  this.commoditySortDirection = sort.direction || 'asc';
  this.loadCommodities();
}

onUserSortChange(sort: Sort): void {
  this.userSortActive = sort.active;
  this.userSortDirection = sort.direction || 'asc';
  this.applyFilterUsers();
}

onCommodityPageChange(event: PageEvent): void {
  this.commodityPageIndex = event.pageIndex;
  this.commodityPageSize = event.pageSize;
  this.applyFilterCommodities();
}

onCommoditySearchChange(): void {
  this.commodityPageIndex = 0;
  this.applyFilterCommodities();
}

// Apply Search & Pagination for Users
applyFilterUsers(): void {
  let filteredData = this.allUsers.filter(user =>
    user.name.toLowerCase().includes(this.userSearchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(this.userSearchTerm.toLowerCase())
  );
  this.applySort(filteredData, this.userSortActive, this.userSortDirection);
  this.paginateUsers(filteredData);
}

paginateUsers(filteredData: any[]): void {
  const start = this.userPageIndex * this.userPageSize;
  const end = start + this.userPageSize;
  this.usersDataSource.data = filteredData.slice(start, end);
}

onUserPageChange(event: PageEvent): void {
  this.userPageIndex = event.pageIndex;
  this.userPageSize = event.pageSize;
  this.applyFilterUsers();
}

onUserSearchChange(): void {
  this.userPageIndex = 0;
  this.applyFilterUsers();
}

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
        this.showNotification('User added successfully', 'success');
      }
    });
  }

  confirmDeleteUser(id: number, username: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete user "${username}"?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteUser(id, username);
      }
    });
  }

  deleteUser(id: number, username: string): void {
    this.adminService.deleteUser(id).subscribe({
      next: () => {
        this.showNotification(`User "${username}" deleted successfully`, 'success');
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.showNotification(`Failed to delete user "${username}"`, 'error');
      }
    });
  }

  applySort(data: any[], active: string, direction: 'asc' | 'desc'): void {
    data.sort((a, b) => {
      let valueA = a[active];
      let valueB = b[active];

      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // CSV Upload functionality
  uploadCSV(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);
  
      this.adminService.uploadCommodityCSV(formData).subscribe({
        next: () => {
          this.showNotification('Commodities CSV uploaded successfully', 'success');
          this.loadCommodities();
        },
        error: (err) => {
          console.error('Error uploading CSV:', err);
          this.showNotification('Failed to upload CSV file', 'error');
        }
      });
    }
  }

  // Utility functions
  showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: `notification-${type}`,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
  
  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/home']);
    this.showNotification('Logged out successfully', 'info');
  }
  
  changeTab(tab: string): void {
    this.selectedTab = tab;
    // Update URL to reflect tab
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab },
      queryParamsHandling: 'merge'
    });
  }
}