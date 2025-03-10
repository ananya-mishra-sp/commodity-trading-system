import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommodityService } from '../../services/commodity.service';
import { TransactionService } from '../../services/transaction.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommodityChartComponent } from '../../components/commodity-chart/commodity-chart.component';
import { TradePopupComponent } from '../../components/trade-popup/trade-popup.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  imports: [CommonModule, NavbarComponent, CommodityChartComponent, MatButtonModule, MatSelectModule, MatSnackBarModule]
})
export class UserDashboardComponent implements OnInit {
  commoditiesList: any[] = [];
  selectedSort: string = 'name-asc';

  constructor(
    private commodityService: CommodityService,
    private transactionService: TransactionService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCommodities();
  }

  loadCommodities() {
    this.commodityService.getCommodities().subscribe({
      next: (commodities) => {
        this.commoditiesList = commodities;
        this.sortCommodities();
      },
      error: (err) => {
        console.error('Error fetching commodities:', err);
      }
    });
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

  sortCommodities() {
    if (this.selectedSort === 'name-asc') {
      this.commoditiesList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.selectedSort === 'name-desc') {
      this.commoditiesList.sort((a, b) => b.name.localeCompare(a.name));
    } else if (this.selectedSort === 'price-low-high') {
      this.commoditiesList.sort((a, b) => a.price - b.price);
    } else if (this.selectedSort === 'price-high-low') {
      this.commoditiesList.sort((a, b) => b.price - a.price);
    }
  }
}
