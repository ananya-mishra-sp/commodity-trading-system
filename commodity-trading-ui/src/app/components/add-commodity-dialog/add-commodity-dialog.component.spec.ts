import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommodityDialogComponent } from './add-commodity-dialog.component';

describe('AddCommodityDialogComponent', () => {
  let component: AddCommodityDialogComponent;
  let fixture: ComponentFixture<AddCommodityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCommodityDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCommodityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
