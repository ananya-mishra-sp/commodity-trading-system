import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-commodity-chart',
  standalone: true,
  templateUrl: './commodity-chart.component.html',
  styleUrls: ['./commodity-chart.component.css'],
  imports: [CommonModule, MatButtonModule, MatCardModule]
})
export class CommodityChartComponent {
  @Input() commodities: any[] = [];
  @Output() trade = new EventEmitter<any>();

  onTrade(commodity: any) {
    this.trade.emit(commodity);
  }
}