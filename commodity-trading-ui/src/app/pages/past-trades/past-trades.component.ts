import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
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
    MatSliderModule,
    ReactiveFormsModule
  ],
  templateUrl: './past-trades.component.html',
  styleUrls: ['./past-trades.component.css']
})
export class PastTradesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['tradeDate', 'commodity', 'tradeType', 'quantity', 'tradePrice', 'totalValue'];

  // Data source with pagination and sorting
  transactions: any[] = [];
  filteredTransactions = new MatTableDataSource<any>([]);
  showFilters = true;

  userId: number | null = null;

  // For price and quantity sliders
  maxPrice = 1000;
  maxQuantity = 1000;
  priceStep = 10;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Filtering
  filterForm = new FormGroup({
    dateFrom: new FormControl<Date | null>(null),
    dateTo: new FormControl<Date | null>(null),
    commodity: new FormControl(''),
    tradeType: new FormControl(''),
    minPrice: new FormControl<number>(0),
    maxPrice: new FormControl<number>(1000),
    minQuantity: new FormControl<number>(0),
    maxQuantity: new FormControl<number>(1000)
  });

  // For dropdowns
  commodities: any[] = [];
  tradeTypes = ['Buy', 'Sell'];
  
  // For custom sorting
  activeSortField: string = 'tradeDate';
  activeSortDirection: string = 'desc';

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
    this.filteredTransactions.paginator = this.paginator;
    this.filteredTransactions.sort = this.sort;
    
    // Custom sort function to handle nested properties like commodity.name
    this.filteredTransactions.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'commodity': return item.commodity.name;
        default: return item[property];
      }
    };
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
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
          this.transactions = trades.sort((a: any, b: any) => 
            new Date(b.tradeDate).getTime() - new Date(a.tradeDate).getTime());
          
          // Set the max values for sliders
          if (trades.length > 0) {
            const maxPriceValue = Math.max(...trades.map(t => t.tradePrice));
            this.maxPrice = Math.ceil(maxPriceValue / 100) * 100; // Round up to nearest hundred
            this.filterForm.get('maxPrice')?.setValue(this.maxPrice);
            
            const maxQuantityValue = Math.max(...trades.map(t => t.quantity));
            this.maxQuantity = Math.ceil(maxQuantityValue / 10) * 10; // Round up to nearest ten
            this.filterForm.get('maxQuantity')?.setValue(this.maxQuantity);
          }
          
          this.filteredTransactions.data = this.transactions;
          this.applySorting();
        },
        error: (err) => {
          console.error('Error fetching past trades:', err);
        }
      });
    }
  }

  setTradeType(type: string) {
    this.filterForm.get('tradeType')?.setValue(type);
    this.applyFilters();
  }

  applyFilters() {
    const filters = this.filterForm.value;

    const filteredData = this.transactions.filter(trade => {
      const tradeDate = new Date(trade.tradeDate);

      // Date range filter
      if (filters.dateFrom && tradeDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        if (tradeDate > toDate) {
          return false;
        }
      }

      // Commodity filter
      if (filters.commodity && trade.commodity.id !== filters.commodity) {
        return false;
      }

      // Trade type filter
      if (filters.tradeType && trade.tradeType !== filters.tradeType) {
        return false;
      }

      // Price range filter
      if ((filters.minPrice ?? 0) > trade.tradePrice) {
        return false;
      }
      if ((filters.maxPrice ?? Infinity) < trade.tradePrice) {
        return false;
      }

      // Quantity range filter
      if ((filters.minQuantity ?? 0) > trade.quantity) {
        return false;
      }
      if ((filters.maxQuantity ?? Infinity) < trade.quantity) {
        return false;
      }

      return true;
    });

    this.filteredTransactions.data = filteredData;
    this.applySorting();
    
    if (this.filteredTransactions.paginator) {
      this.filteredTransactions.paginator.firstPage();
    }
  }

  resetFilters() {
    this.filterForm.reset({
      dateFrom: null,
      dateTo: null,
      commodity: '',
      tradeType: '',
      minPrice: 0,
      maxPrice: this.maxPrice,
      minQuantity: 0,
      maxQuantity: this.maxQuantity
    });
    
    this.filteredTransactions.data = [...this.transactions];
    this.applySorting();
    
    if (this.filteredTransactions.paginator) {
      this.filteredTransactions.paginator.firstPage();
    }
  }

  applySearchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredTransactions.filter = filterValue.trim().toLowerCase();
    
    // Custom filter predicate to search through nested properties
    this.filteredTransactions.filterPredicate = (data: any, filter: string) => {
      const searchStr = (data.commodity.name + ' ' + 
                        data.tradeType + ' ' + 
                        data.quantity).toLowerCase();
      return searchStr.indexOf(filter) !== -1;
    };
    
    if (this.filteredTransactions.paginator) {
      this.filteredTransactions.paginator.firstPage();
    }
  }

  changeSorting(event: any) {
    const [field, direction] = event.value.split(',');
    this.activeSortField = field;
    this.activeSortDirection = direction;
    this.applySorting();
  }

  applySorting() {
    const data = [...this.filteredTransactions.data];
    
    // Custom sort function to handle complex sorting
    data.sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      // Extract the correct values based on the field
      switch(this.activeSortField) {
        case 'commodity':
          valueA = a.commodity.name;
          valueB = b.commodity.name;
          break;
        case 'tradeDate':
          valueA = new Date(a.tradeDate).getTime();
          valueB = new Date(b.tradeDate).getTime();
          break;
        default:
          valueA = a[this.activeSortField];
          valueB = b[this.activeSortField];
      }
      
      // Compare the values
      let comparison = 0;
      if (valueA > valueB) {
        comparison = 1;
      } else if (valueA < valueB) {
        comparison = -1;
      }
      
      // Respect the sort direction
      return this.activeSortDirection === 'desc' ? -comparison : comparison;
    });
    
    this.filteredTransactions.data = data;
  }

  exportToCsv() {
    const headers = ['Trade Date', 'Commodity', 'Type', 'Quantity', 'Price', 'Total Value'];
  
    const csvRows = [
      headers.join(','),
      ...this.filteredTransactions.data.map(row => [
        `"${new Date(row.tradeDate).toLocaleString()}"`, // Wrap date-time in double quotes
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