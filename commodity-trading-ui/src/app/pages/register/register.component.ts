import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    CommonModule,
    MatSnackBarModule
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  usernameExists: boolean = false;
  emailExists: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<RegisterComponent>,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  checkUsernameExists() {
    const username = this.registerForm.get('username')?.value;
    if (username) {
      this.authService.checkUsername(username).subscribe((exists) => {
        this.usernameExists = exists;
      });
    }
  }

  checkEmailExists() {
    const email = this.registerForm.get('email')?.value;
    if (email) {
      this.authService.checkEmail(email).subscribe((exists) => {
        this.emailExists = exists;
      });
    }
  }

  register() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      if (this.usernameExists || this.emailExists) {
        this.errorMessage = 'Username or email already exists';
        return;
      }

      const userData = {
        name: this.registerForm.value.fullName, // Fixing "fullName" -> "name"
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      };  

      this.authService.register(userData).subscribe({
        next: () => {
          this.snackBar.open('Registration Successful! Redirecting to login...', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar',
          });
          this.dialogRef.close();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Registration failed';
        },
      });
    }
  }
}
