import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    CommonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    MatCheckboxModule
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  hidePassword: boolean = true;
  isLoading: boolean = false;
  showSuccessAlert: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Simulate network delay (remove in production)
      setTimeout(() => {
        this.authService.login(this.loginForm.value).subscribe({
          next: (response) => {
            localStorage.setItem('userId', response.userId.toString());
            localStorage.setItem('role', response.role);
            
            this.isLoading = false;
            this.showSuccessAlert = true;
            
            // Short delay before closing dialog and redirecting
            setTimeout(() => {
              this.dialogRef.close();
              
              if (response.role === 'User') {
                this.router.navigate(['/user-dashboard']);
              } else if (response.role === 'Admin') {
                this.router.navigate(['/admin-dashboard']);
              }
            }, 1500);
          },
          error: (err) => {
            this.isLoading = false;
            if (err.status === 401) {
              this.errorMessage = 'Invalid username or password';
            } else if (err.status === 403) {
              this.errorMessage = 'Your account has been locked. Please contact support.';
            } else {
              this.errorMessage = 'Login failed. Please try again.';
            }
            
            // Shake animation for form on error
            const form = document.querySelector('.login-form');
            form?.classList.add('shake');
            setTimeout(() => {
              form?.classList.remove('shake');
            }, 500);
          },
        });
      }, 800); // Simulated delay
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }
  
  // Helper method to trigger validation messages
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
  
  openRegisterDialog() {
    this.dialogRef.close();
    this.dialog.open(RegisterComponent, { 
      width: '400px',
      panelClass: 'auth-dialog'
    });
  }
}