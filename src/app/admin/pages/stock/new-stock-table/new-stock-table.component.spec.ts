import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStockTableComponent } from './new-stock-table.component';

describe('NewStockTableComponent', () => {
  let component: NewStockTableComponent;
  let fixture: ComponentFixture<NewStockTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewStockTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewStockTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
