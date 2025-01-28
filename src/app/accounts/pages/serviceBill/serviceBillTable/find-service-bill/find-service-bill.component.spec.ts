import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindServiceBillComponent } from './find-service-bill.component';

describe('FindServiceBillComponent', () => {
  let component: FindServiceBillComponent;
  let fixture: ComponentFixture<FindServiceBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindServiceBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindServiceBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
