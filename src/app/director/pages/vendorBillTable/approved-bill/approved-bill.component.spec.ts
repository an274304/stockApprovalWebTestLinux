import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedBillComponent } from './approved-bill.component';

describe('ApprovedBillComponent', () => {
  let component: ApprovedBillComponent;
  let fixture: ComponentFixture<ApprovedBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
