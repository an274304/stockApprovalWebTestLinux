import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRejectedBillComponent } from './view-rejected-bill.component';

describe('ViewRejectedBillComponent', () => {
  let component: ViewRejectedBillComponent;
  let fixture: ComponentFixture<ViewRejectedBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRejectedBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRejectedBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
