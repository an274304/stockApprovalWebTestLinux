import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServicePendingBillComponent } from './view-service-pending-bill.component';

describe('ViewServicePendingBillComponent', () => {
  let component: ViewServicePendingBillComponent;
  let fixture: ComponentFixture<ViewServicePendingBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewServicePendingBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewServicePendingBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
