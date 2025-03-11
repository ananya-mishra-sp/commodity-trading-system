import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TransactionService } from '../../services/transaction.service';

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

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadPastTrades();
  }

  loadPastTrades() {
    const userId = 1;  // Replace with actual logged-in user ID
    this.transactionService.getUserTransactions(userId).subscribe({
      next: (trades) => {
        this.transactions = trades;
      },
      error: (err) => {
        console.error('Error fetching past trades:', err);
      }
    });
  }
}
