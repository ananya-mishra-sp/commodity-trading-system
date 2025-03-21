import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AdminService } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-commodity-dialog',
  templateUrl: './add-commodity-dialog.component.html',
  styleUrls: ['./add-commodity-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class AddCommodityDialogComponent {
  commodityForm: FormGroup;
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddCommodityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.commodityForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      unit: ['', [Validators.required, Validators.maxLength(50)]],
      currentPrice: ['', [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
  }
  
  onSubmit(): void {
    if (this.commodityForm.invalid) {
      return;
    }
    
    this.loading = true;
    const commodityData = this.commodityForm.value;
    
    // Convert price to number to ensure proper formatting
    commodityData.currentPrice = parseFloat(commodityData.currentPrice);
    
    this.adminService.createCommodity(commodityData).subscribe({
      next: (response) => {
        this.snackBar.open('Commodity Data Save Successful', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
        this.dialogRef.close(response);
      },
      error: (error) => {
        let errorMessage = 'Wrong details.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
}