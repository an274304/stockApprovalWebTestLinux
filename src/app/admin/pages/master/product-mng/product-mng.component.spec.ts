import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMngComponent } from './product-mng.component';

describe('ProductMngComponent', () => {
  let component: ProductMngComponent;
  let fixture: ComponentFixture<ProductMngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductMngComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
