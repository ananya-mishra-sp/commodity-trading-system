import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHistoryDialogComponent } from './report-history-dialog.component';

describe('ReportHistoryDialogComponent', () => {
  let component: ReportHistoryDialogComponent;
  let fixture: ComponentFixture<ReportHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportHistoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
