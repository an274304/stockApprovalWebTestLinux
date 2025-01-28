import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetWaitingOrderAtAdminComponent } from './get-waiting-order-at-admin.component';

describe('GetWaitingOrderAtAdminComponent', () => {
  let component: GetWaitingOrderAtAdminComponent;
  let fixture: ComponentFixture<GetWaitingOrderAtAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetWaitingOrderAtAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetWaitingOrderAtAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
