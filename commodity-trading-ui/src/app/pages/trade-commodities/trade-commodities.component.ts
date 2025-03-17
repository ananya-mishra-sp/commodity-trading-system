import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { CommodityService } from '../../services/commodity.service';
import { CommodityChartComponent } from '../../components/commodity-chart/commodity-chart.component';
import { TradePopupComponent } from '../../components/trade-popup/trade-popup.component';

@Component({
  selector: 'app-trade-commodities',
  standalone: true,
  templateUrl: './trade-commodities.component.html',
  styleUrls: ['./trade-commodities.component.css'],
  imports: [
    CommonModule, 
    CommodityChartComponent, 
    MatButtonModule, 
    MatSelectModule, 
    MatSnackBarModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatCardModule,
    MatDividerModule,
    FormsModule
  ]
})
export class TradeCommoditiesComponent implements OnInit {
  commoditiesList: any[] = [];
  filteredCommodities: any[] = [];
  paginatedCommodities: any[] = [];
  selectedSort: string = 'name-asc';
  searchQuery: string = '';
  
  // Pagination settings
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 15, 20];
  pageIndex: number = 0;
  totalItems: number = 0;

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
        this.filterCommodities();
      },
      error: (err) => {
        console.error('Error fetching commodities:', err);
        this.snackBar.open('Failed to load commodities', 'Retry', { 
          duration: 5000,
          panelClass: 'error-snackbar'
        }).onAction().subscribe(() => this.loadCommodities());
      }
    });
  }

  sortCommodities() {
    this.loadCommodities();
  }

  searchCommodities() {
    this.filterCommodities();
    this.resetPagination();
  }

  filterCommodities() {
    if (!this.searchQuery.trim()) {
      this.filteredCommodities = [...this.commoditiesList];
    } else {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredCommodities = this.commoditiesList.filter(commodity => 
        commodity.name.toLowerCase().includes(query)
      );
    }
    
    this.totalItems = this.filteredCommodities.length;
    this.updatePaginatedCommodities();
  }

  clearSearch() {
    this.searchQuery = '';
    this.filterCommodities();
    this.resetPagination();
  }

  resetPagination() {
    this.pageIndex = 0;
    this.updatePaginatedCommodities();
  }

  updatePaginatedCommodities() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCommodities = this.filteredCommodities.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedCommodities();
  }

  openTradePopup(commodity: any) {
    const dialogRef = this.dialog.open(TradePopupComponent, {
      width: '500px',
      panelClass: 'trade-dialog',
      data: { commodity }
    });

    dialogRef.afterClosed().subscribe((tradeSuccess) => {
      if (tradeSuccess) {
        this.snackBar.open('Trade successful!', 'OK', { 
          duration: 3000, 
          panelClass: 'success-snackbar' 
        });
        this.loadCommodities();
      }
    });
  }
}