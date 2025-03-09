import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms'; // ✅ Import this

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
    ReactiveFormsModule // ✅ Add this
  ]
})
export class TradePopupComponent {
  tradeForm: FormGroup; // ✅ Ensure tradeForm is declared

  constructor(
    public dialogRef: MatDialogRef<TradePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.tradeForm = this.fb.group({
      quantity: [null, [Validators.required, Validators.min(1)]], // ✅ Ensure this is correctly initialized
      action: ['buy', Validators.required]
    });
  }

  submitTrade() {
    if (this.tradeForm.valid) {
      console.log('Trade submitted:', {
        commodity: this.data.commodity,
        ...this.tradeForm.value
      });

      this.dialogRef.close(this.tradeForm.value); // ✅ Close dialog with form data
    }
  }
}
