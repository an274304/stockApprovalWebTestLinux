import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPurchaseFormComponent } from './new-purchase-form.component';

describe('NewPurchaseFormComponent', () => {
  let component: NewPurchaseFormComponent;
  let fixture: ComponentFixture<NewPurchaseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPurchaseFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPurchaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
