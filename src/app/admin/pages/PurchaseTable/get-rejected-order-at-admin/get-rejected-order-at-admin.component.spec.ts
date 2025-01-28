import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetRejectedOrderAtAdminComponent } from './get-rejected-order-at-admin.component';

describe('GetRejectedOrderAtAdminComponent', () => {
  let component: GetRejectedOrderAtAdminComponent;
  let fixture: ComponentFixture<GetRejectedOrderAtAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetRejectedOrderAtAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetRejectedOrderAtAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
