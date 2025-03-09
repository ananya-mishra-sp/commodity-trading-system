import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityChartComponent } from './commodity-chart.component';

describe('CommodityChartComponent', () => {
  let component: CommodityChartComponent;
  let fixture: ComponentFixture<CommodityChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommodityChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommodityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
