import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginComponent } from '../login/login.component';
import { of, timer } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

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
    MatSnackBarModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  usernameExists: boolean = false;
  emailExists: boolean = false;
  checkingUsername: boolean = false;
  checkingEmail: boolean = false;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  formSubmitting: boolean = false;
  registrationSuccess: boolean = false;
  passwordStrength: number = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<RegisterComponent>,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9_-]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    }, { 
      validators: this.passwordMatchValidator 
    });

    // Monitor password changes to calculate strength
    this.registerForm.get('password')?.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(password => {
      if (password) {
        this.calculatePasswordStrength(password);
      } else {
        this.passwordStrength = 0;
      }
    });

    // Setup username check with debounce
    this.registerForm.get('username')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(username => {
        if (!username || username.length < 3) return of(false);
        this.checkingUsername = true;
        return this.authService.checkUsername(username);
      })
    ).subscribe(exists => {
      this.usernameExists = exists;
      this.checkingUsername = false;
    });

    // Setup email check with debounce
    this.registerForm.get('email')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(email => {
        if (!email || !this.isValidEmail(email)) return of(false);
        this.checkingEmail = true;
        return this.authService.checkEmail(email);
      })
    ).subscribe(exists => {
      this.emailExists = exists;
      this.checkingEmail = false;
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  calculatePasswordStrength(password: string): void {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 1;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    this.passwordStrength = Math.min(4, strength);
  }

  getPasswordStrengthText(): string {
    switch(this.passwordStrength) {
      case 0:
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  }

  getPasswordStrengthClass(): string {
    switch(this.passwordStrength) {
      case 0:
      case 1: return 'weak';
      case 2: return 'fair';
      case 3: return 'good';
      case 4: return 'strong';
      default: return '';
    }
  }

  checkUsernameExists() {
    const username = this.registerForm.get('username')?.value;
    if (username && username.length >= 3) {
      this.checkingUsername = true;
      this.authService.checkUsername(username).subscribe({
        next: exists => {
          this.usernameExists = exists;
          this.checkingUsername = false;
        },
        error: () => {
          this.snackBar.open('Failed to verify username availability', 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
          this.checkingUsername = false;
        }
      });
    }
  }

  checkEmailExists() {
    const email = this.registerForm.get('email')?.value;
    if (email && this.isValidEmail(email)) {
      this.checkingEmail = true;
      this.authService.checkEmail(email).subscribe({
        next: exists => {
          this.emailExists = exists;
          this.checkingEmail = false;
        },
        error: () => {
          this.snackBar.open('Failed to verify email availability', 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
          this.checkingEmail = false;
        }
      });
    }
  }

  openLoginDialog(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.dialogRef.close();
    this.dialog.open(LoginComponent, {
      width: '400px',
      disableClose: false
    });
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
        name: this.registerForm.value.fullName,
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      };
      
      this.formSubmitting = true;
      this.errorMessage = '';

      // Register user
      this.authService.register(userData).pipe(
        finalize(() => {
          // Use timer to simulate network delay (remove in production)
          timer(1500).subscribe(() => {
            this.formSubmitting = false;
          });
        })
      ).subscribe({
        next: (response) => {
          this.registrationSuccess = true;
          this.snackBar.open('Registration successful! You can now login.', 'Close', {
            duration: 5000,
            panelClass: 'success-snackbar',
          });
          
          // Optionally redirect to login after a delay
          // timer(3000).subscribe(() => {
          //   this.dialogRef.close(true);
          //   this.router.navigate(['/login']);
          // });
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          this.formSubmitting = false;
        }
      });
    } else {
      // Mark all form controls as touched to trigger validation messages
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}