import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { CommodityService } from '../../services/commodity.service';

@Component({
  selector: 'app-past-trades',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    ReactiveFormsModule
  ],
  templateUrl: './past-trades.component.html',
  styleUrls: ['./past-trades.component.css']
})
export class PastTradesComponent implements OnInit {
  displayedColumns: string[] = ['tradeDate', 'commodity', 'tradeType', 'quantity', 'tradePrice', 'totalValue'];

  // Data source with pagination
  transactions: any[] = [];
  filteredTransactions = new MatTableDataSource<any>([]); // Using MatTableDataSource

  userId: number | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginator reference

  // Filtering
  filterForm = new FormGroup({
    dateFrom: new FormControl<Date | null>(null),
    dateTo: new FormControl<Date | null>(null),
    commodity: new FormControl(''),
    tradeType: new FormControl(''),
    minPrice: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null),
    minQuantity: new FormControl<number | null>(null),
    maxQuantity: new FormControl<number | null>(null)
  });

  // For dropdowns
  commodities: any[] = [];
  tradeTypes = ['Buy', 'Sell'];

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private commodityService: CommodityService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    if (this.userId !== null) {
      this.loadPastTrades();
      this.loadCommodities();
    } else {
      console.error('No logged-in user found!');
    }
  }

  ngAfterViewInit() {
    this.filteredTransactions.paginator = this.paginator; // Set paginator after view init
    this.filteredTransactions.sort = this.sort; // Set sorting
  }

  loadCommodities() {
    this.commodityService.getCommodities().subscribe({
      next: (commodities) => {
        this.commodities = commodities;
      },
      error: (err) => {
        console.error('Error fetching commodities:', err);
      }
    });
  }

  loadPastTrades() {
    if (this.userId !== null) {
      this.transactionService.getUserTransactions(this.userId).subscribe({
        next: (trades: any[]) => {
          // Sort trades in descending order (latest first)
          this.transactions = trades.sort((a: any, b: any) => new Date(b.tradeDate).getTime() - new Date(a.tradeDate).getTime());
          this.filteredTransactions.data = this.transactions; // Assign transactions to MatTableDataSource
          this.applyFilters(); // Apply filters initially if needed
        },
        error: (err) => {
          console.error('Error fetching past trades:', err);
        }
      });
    }
  }

  applyFilters() {
    const filters = this.filterForm.value;

    const filteredData = this.transactions.filter(trade => {
      const tradeDate = new Date(trade.tradeDate);

      // Date range filter
      if (filters.dateFrom && tradeDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && tradeDate > filters.dateTo) {
        return false;
      }

      // Commodity filter
      if (filters.commodity && trade.commodity.id !== filters.commodity) {
        return false;
      }

      // Trade type filter
      if (filters.tradeType && trade.tradeType !== filters.tradeType) {
        return false;
      }

      // // Price range filter
      // if ((filters.minPrice ?? 0) > trade.tradePrice) {
      //   return false;
      // }
      // if ((filters.maxPrice ?? Infinity) < trade.tradePrice) {
      //   return false;
      // }

      // // Quantity range filter
      // if ((filters.minQuantity ?? 0) > trade.quantity) {
      //   return false;
      // }
      // if ((filters.maxQuantity ?? Infinity) < trade.quantity) {
      //   return false;
      // }

      return true;
    });

    this.filteredTransactions.data = filteredData; // Update table with filtered results
  }

  resetFilters() {
    this.filterForm.reset();
    this.filteredTransactions.data = [...this.transactions]; // Reset to original transactions
  }

  exportToCsv() {
    const headers = ['Trade Date', 'Commodity', 'Type', 'Quantity', 'Price', 'Total Value'];

    const csvRows = [
      headers.join(','),
      ...this.filteredTransactions.data.map(row => [
        new Date(row.tradeDate).toLocaleString(),
        row.commodity.name,
        row.tradeType,
        row.quantity,
        row.tradePrice,
        row.totalValue
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `past-trades-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    window.URL.revokeObjectURL(url);
  }
}
