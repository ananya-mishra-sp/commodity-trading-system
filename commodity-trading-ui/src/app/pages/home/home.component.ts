import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { CommodityDetailsComponent } from '../../components/commodity-details/commodity-details.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule, MatButtonModule, MatDialogModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  commodities = [
    { 
      name: 'Gold', 
      description: 'A valuable precious metal used in jewelry and investment.', 
      image: './assets/images/gold.jpg', 
      flipped: false,
      details: 'Gold has been a symbol of wealth and prosperity for centuries. It is widely used for jewelry, investment, and even in electronics due to its conductivity. During economic uncertainty, gold is considered a safe-haven asset, making it a popular choice among investors.'
    },
    { 
      name: 'Crude Oil', 
      description: 'Essential for energy production and global industries.', 
      image: './assets/images/crude-oil.jpg', 
      flipped: false,
      details: 'Crude oil is the backbone of the global economy, fueling transportation, industries, and power generation. It is refined into gasoline, diesel, and other petroleum products. Fluctuations in oil prices can significantly impact stock markets and national economies.'
    },
    { 
      name: 'Silver', 
      description: 'Used in electronics, jewelry, and investment.', 
      image: './assets/images/silver.jpg', 
      flipped: false,
      details: 'Silver is known as the metal of the future due to its high conductivity and anti-bacterial properties. It is widely used in solar panels, medical instruments, and industrial applications. Silver’s demand continues to rise as technology advances.'
    },
    { 
      name: 'Aluminium', 
      description: 'Lightweight metal used in aerospace and construction.', 
      image: './assets/images/aluminium.jpg', 
      flipped: false,
      details: 'Aluminium is a lightweight, corrosion-resistant metal widely used in aerospace, construction, and packaging. It is infinitely recyclable, making it an eco-friendly choice in manufacturing and sustainability efforts.'
    },
    { 
      name: 'Copper', 
      description: 'Vital for electrical wiring and industrial use.', 
      image: './assets/images/copper.jpg', 
      flipped: false,
      details: 'Copper is an essential element in modern infrastructure. It is widely used in electrical wiring, plumbing, and renewable energy technologies. With the rise of electric vehicles and green energy, the demand for copper is expected to surge.'
    },
    { 
      name: 'Natural Gas', 
      description: 'Key energy source for heating and electricity.', 
      image: './assets/images/natural-gas.jpg', 
      flipped: false,
      details: 'Natural gas is a crucial energy source for homes, businesses, and industries. It is a cleaner alternative to coal and oil, playing a vital role in the transition to a low-carbon economy. It is used for heating, electricity generation, and as a raw material for chemicals.'
    }
  ];  

  constructor(private dialog: MatDialog) {}

  openRegisterDialog() {
    this.dialog.open(RegisterComponent, { width: '400px' });
  }

  openLoginDialog() {
    this.dialog.open(LoginComponent, { width: '400px' });
  }

  openCommodityDetails(commodity: any) {
    this.dialog.open(CommodityDetailsComponent, {
      width: '400px',
      data: commodity
    });
  }

}


