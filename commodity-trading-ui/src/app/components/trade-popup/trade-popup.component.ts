import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-trade-popup',
  standalone: true,
  templateUrl: './trade-popup.component.html',
  styleUrls: ['./trade-popup.component.css'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ]
})
export class TradePopupComponent {
  tradeForm: FormGroup;
  totalPrice: number = 0; // Stores total price dynamically

  constructor(
    public dialogRef: MatDialogRef<TradePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    
    this.tradeForm = this.fb.group({
      quantity: [null, [Validators.required, Validators.min(1)]],
      action: ['buy', Validators.required]
    });

    // Listen for quantity changes and update total price
    this.tradeForm.get('quantity')?.valueChanges.subscribe((quantity) => {
      this.updateTotalPrice(quantity);
    });
  }

  updateTotalPrice(quantity: number) {
    if (quantity && quantity > 0) {
      this.totalPrice = quantity * this.data.commodity.currentPrice;
    } else {
      this.totalPrice = 0;
    }
  }

  submitTrade() {
    if (this.tradeForm.valid) {
      const userId = this.authService.getUserId(); // Get user ID from AuthService

    if (!userId) {
      this.snackBar.open('Error: User not authenticated!', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
      return;
    }

      const tradeData = {
        userId, // Replace with actual logged-in user ID
        commodityId: this.data.commodity.id,
        tradePrice: this.data.commodity.currentPrice,
        tradeType: this.capitalizeFirstLetter(this.tradeForm.value.action),
        quantity: this.tradeForm.value.quantity
      };

      console.log(tradeData);

      this.transactionService.placeTrade(tradeData).subscribe({
        next: () => {
          this.snackBar.open('Transaction Successful!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open('Transaction Failed!', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
        }
      });
    }
  }
  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
