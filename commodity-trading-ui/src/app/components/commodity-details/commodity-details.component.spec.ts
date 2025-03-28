import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityDetailsComponent } from './commodity-details.component';

describe('CommodityDetailsComponent', () => {
  let component: CommodityDetailsComponent;
  let fixture: ComponentFixture<CommodityDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommodityDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommodityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
