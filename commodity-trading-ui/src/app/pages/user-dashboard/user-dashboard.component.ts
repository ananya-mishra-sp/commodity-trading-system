import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommodityService } from '../../services/commodity.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TradePopupComponent } from '../../components/trade-popup/trade-popup.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  imports: [CommonModule, NavbarComponent, MatButtonModule, MatSelectModule, MatSnackBarModule, RouterOutlet]
})
export class UserDashboardComponent {
  commoditiesList: any[] = [];
  selectedSort: string = 'name-asc';

  constructor(
    private commodityService: CommodityService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCommodities();
  }

  loadCommodities() {
    const [sortBy, order] = this.selectedSort.split('-');
    this.commodityService.getCommodities(sortBy, order).subscribe({
      next: (commodities) => {
        this.commoditiesList = commodities;
      },
      error: (err) => {
        console.error('Error fetching commodities:', err);
      }
    });
  }

  sortCommodities() {
    this.loadCommodities();
  }


  openTradePopup(commodity: any) {
    const dialogRef = this.dialog.open(TradePopupComponent, {
      width: '400px',
      data: { commodity }
    });

    dialogRef.afterClosed().subscribe((tradeSuccess) => {
      if (tradeSuccess) {
        this.snackBar.open('Trade successful!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
      }
    });
  }
}
