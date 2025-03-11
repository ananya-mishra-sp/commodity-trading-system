import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastTradesComponent } from './past-trades.component';

describe('PastTradesComponent', () => {
  let component: PastTradesComponent;
  let fixture: ComponentFixture<PastTradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastTradesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastTradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
