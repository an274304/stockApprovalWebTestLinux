import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingBillComponent } from './pending-bill.component';

describe('PendingBillComponent', () => {
  let component: PendingBillComponent;
  let fixture: ComponentFixture<PendingBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
