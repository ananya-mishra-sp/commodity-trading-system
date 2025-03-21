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
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css'],
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
export class AddUserDialogComponent {
  userForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]{3,30}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8),
                      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.checkPasswordMatch });
  }
  
  checkPasswordMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  
  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }
    
    this.loading = true;
    // Remove confirmPassword before sending to API
    const userData = { ...this.userForm.value };
    delete userData.confirmPassword;
    
    this.adminService.createUser(userData).subscribe({
      next: (response) => {
        this.snackBar.open('User added successfully', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
        this.dialogRef.close(response);
      },
      error: (error) => {
        let errorMessage = 'Failed to add user';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 409) {
          errorMessage = 'Username or email already exists';
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
  
  getPasswordErrorMessage(): string {
    const passwordControl = this.userForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 8 characters';
    }
    if (passwordControl?.hasError('pattern')) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    return '';
  }
}