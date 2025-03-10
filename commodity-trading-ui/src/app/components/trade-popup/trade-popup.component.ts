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

  constructor(
    public dialogRef: MatDialogRef<TradePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar
  ) {
    this.tradeForm = this.fb.group({
      quantity: [null, [Validators.required, Validators.min(1)]],
      action: ['buy', Validators.required]
    });
  }

  submitTrade() {
    if (this.tradeForm.valid) {
      const tradeData = {
        userId: 1, // Replace with actual logged-in user ID
        commodityId: this.data.commodity.id,
        tradeType: this.tradeForm.value.action.toUpperCase(),
        quantity: this.tradeForm.value.quantity
      };

      this.transactionService.placeTrade(tradeData).subscribe({
        next: () => {
          this.snackBar.open('Transaction Successful!', 'OK', { duration: 3000, panelClass: 'success-snackbar' });
          this.dialogRef.close(true); // Send success status back to dashboard
        },
        error: () => {
          this.snackBar.open('Transaction Failed!', 'OK', { duration: 3000, panelClass: 'error-snackbar' });
        }
      });
    }
  }
}
