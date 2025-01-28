import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMngComponent } from './vendor-mng.component';

describe('VendorMngComponent', () => {
  let component: VendorMngComponent;
  let fixture: ComponentFixture<VendorMngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorMngComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
