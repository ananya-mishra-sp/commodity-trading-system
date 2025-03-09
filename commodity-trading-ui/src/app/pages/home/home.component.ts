import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule, MatButtonModule, MatDialogModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  commodities = [
    { name: 'Gold', description: 'A valuable precious metal used in jewelry and investment.', image: './assets/images/gold.jpg', flipped: false },
    { name: 'Crude Oil', description: 'Essential for energy production and global industries.', image: './assets/images/crude-oil.jpg', flipped: false },
    { name: 'Silver', description: 'Used in electronics, jewelry, and investment.', image: './assets/images/silver.jpg', flipped: false },
    { name: 'Aluminium', description: 'Lightweight metal used in aerospace and construction.', image: './assets/images/aluminium.jpg', flipped: false },
    { name: 'Copper', description: 'Vital for electrical wiring and industrial use.', image: './assets/images/copper.jpg', flipped: false },
    { name: 'Natural Gas', description: 'Key energy source for heating and electricity.', image: './assets/images/natural-gas.jpg', flipped: false }
  ];

  constructor(private dialog: MatDialog) {}

  openRegisterDialog() {
    this.dialog.open(RegisterComponent, { width: '400px' });
  }

  openLoginDialog() {
    this.dialog.open(LoginComponent, { width: '400px' });
  }

  flipCard(commodity: any) {
    commodity.flipped = !commodity.flipped;
  }
}


