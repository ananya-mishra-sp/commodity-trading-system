import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-past-trades',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './past-trades.component.html',
  styleUrls: ['./past-trades.component.css']
})
export class PastTradesComponent implements OnInit {
  displayedColumns: string[] = ['tradeDate', 'commodity', 'tradeType', 'quantity', 'tradePrice', 'totalValue'];
  transactions: any[] = [];
  userId: number | null = null;

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId(); // Get logged-in user ID

    if (this.userId !== null) {
      this.loadPastTrades();
    } else {
      console.error('No logged-in user found!');
    }
  }

  loadPastTrades() {
    if (this.userId !== null) {
      this.transactionService.getUserTransactions(this.userId).subscribe({
        next: (trades) => {
          this.transactions = trades;
        },
        error: (err) => {
          console.error('Error fetching past trades:', err);
        }
      });
    }
  }
}
