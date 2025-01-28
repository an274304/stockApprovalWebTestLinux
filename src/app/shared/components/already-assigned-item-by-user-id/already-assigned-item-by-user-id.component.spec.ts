import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyAssignedItemByUserIdComponent } from './already-assigned-item-by-user-id.component';

describe('AlreadyAssignedItemByUserIdComponent', () => {
  let component: AlreadyAssignedItemByUserIdComponent;
  let fixture: ComponentFixture<AlreadyAssignedItemByUserIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlreadyAssignedItemByUserIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlreadyAssignedItemByUserIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
