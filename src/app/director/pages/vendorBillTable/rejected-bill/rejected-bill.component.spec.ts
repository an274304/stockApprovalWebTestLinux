import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedBillComponent } from './rejected-bill.component';

describe('RejectedBillComponent', () => {
  let component: RejectedBillComponent;
  let fixture: ComponentFixture<RejectedBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
