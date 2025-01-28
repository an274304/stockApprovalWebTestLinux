import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPendingBillComponent } from './view-pending-bill.component';

describe('ViewPendingBillComponent', () => {
  let component: ViewPendingBillComponent;
  let fixture: ComponentFixture<ViewPendingBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPendingBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPendingBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
