import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApprovedBillComponent } from './view-approved-bill.component';

describe('ViewApprovedBillComponent', () => {
  let component: ViewApprovedBillComponent;
  let fixture: ComponentFixture<ViewApprovedBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewApprovedBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewApprovedBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
