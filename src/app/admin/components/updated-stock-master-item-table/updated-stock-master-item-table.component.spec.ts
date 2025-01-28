import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedStockMasterItemTableComponent } from './updated-stock-master-item-table.component';

describe('UpdatedStockMasterItemTableComponent', () => {
  let component: UpdatedStockMasterItemTableComponent;
  let fixture: ComponentFixture<UpdatedStockMasterItemTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatedStockMasterItemTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatedStockMasterItemTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
