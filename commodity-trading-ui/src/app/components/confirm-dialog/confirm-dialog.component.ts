import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports:[MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">
        {{ data.cancelButtonText || 'Cancel' }}
      </button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">
        {{ data.confirmButtonText || 'Confirm' }}
      </button>
    </div>
  `,
  styles: [`
    h2 {
      margin: 0;
      font-weight: 500;
    }
    
    .mat-dialog-content {
      padding: 12px 0;
    }

    button{
      padding: 5px;
      border-radius: 8px;
      border: transparent;
      margin: 5px;
    }
    
    button[color="warn"] {
      color: white;
      background-color:rgba(46, 106, 184, 0.87);
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      message: string;
      confirmButtonText?: string;
      cancelButtonText?: string;
    }
  ) {}
}