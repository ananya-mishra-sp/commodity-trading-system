import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommodityChartComponent } from '../../components/commodity-chart/commodity-chart.component';
import { TradePopupComponent } from '../../components/trade-popup/trade-popup.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  imports: [CommonModule, NavbarComponent, CommodityChartComponent, MatButtonModule, MatSelectModule]
})
export class UserDashboardComponent implements OnInit {
  commoditiesList: any[] = [];
  selectedSort: string = 'name-asc'; // Sorting option

  constructor(private apiService: ApiService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCommodities();
  }

  loadCommodities() {
    this.apiService.getCommodities().subscribe({
      next: (commodities) => {
        this.commoditiesList = commodities;
        this.sortCommodities(); // Apply default sorting
      },
      error: (err) => {
        console.error('Error fetching commodities:', err);
      }
    });
  }

  openTradePopup(commodity: any) {
    this.dialog.open(TradePopupComponent, {
      width: '400px',
      data: { commodity }
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
