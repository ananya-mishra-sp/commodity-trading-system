import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeCommoditiesComponent } from './trade-commodities.component';

describe('TradeCommoditiesComponent', () => {
  let component: TradeCommoditiesComponent;
  let fixture: ComponentFixture<TradeCommoditiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeCommoditiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeCommoditiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
