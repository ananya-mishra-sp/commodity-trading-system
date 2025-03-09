import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-commodity-chart',
  standalone: true,
  templateUrl: './commodity-chart.component.html',
  styleUrls: ['./commodity-chart.component.css'],
  imports: [CommonModule, FormsModule, MatButtonModule, MatSelectModule, MatTableModule]
})
export class CommodityChartComponent {
  @Input() commodities: any[] = [];
  @Output() trade = new EventEmitter<any>();

  displayedColumns: string[] = ['name', 'unit', 'currentPrice', 'trade'];

  sortBy: string = 'name';
  order: string = 'asc';

  sortCommodities() {
    this.commodities.sort((a, b) => {
      let valA = this.sortBy === 'price' ? a.price : a.name.toLowerCase();
      let valB = this.sortBy === 'price' ? b.price : b.name.toLowerCase();
      return this.order === 'asc' ? valA > valB ? 1 : -1 : valA < valB ? 1 : -1;
    });
  }
}
