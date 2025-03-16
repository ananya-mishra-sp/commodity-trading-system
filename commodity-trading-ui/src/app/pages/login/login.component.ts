import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import Snackbar

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
    MatSnackBarModule // Add Snackbar module
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private router: Router,
    private snackBar: MatSnackBar // Inject Snackbar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Changed to username
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          localStorage.setItem('userId', response.userId.toString()); // Store userId
          localStorage.setItem('role', response.role); // Store role
          
          this.snackBar.open('Login Successful', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          this.dialogRef.close();
  
          if (response.role === 'User') {
            this.router.navigate(['/user-dashboard']);
          } else if (response.role === 'Admin') {
            this.router.navigate(['/admin-dashboard']);
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Invalid credentials';
        },
      });
    }
  }  
  
  closeModal() {
    this.dialogRef.close();
  }
}
