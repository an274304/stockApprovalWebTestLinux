import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStockFormComponent } from './new-stock-form.component';

describe('NewStockFormComponent', () => {
  let component: NewStockFormComponent;
  let fixture: ComponentFixture<NewStockFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewStockFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewStockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
