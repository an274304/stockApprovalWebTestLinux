import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyDisposedItemByUserIdComponent } from './already-disposed-item-by-user-id.component';

describe('AlreadyDisposedItemByUserIdComponent', () => {
  let component: AlreadyDisposedItemByUserIdComponent;
  let fixture: ComponentFixture<AlreadyDisposedItemByUserIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlreadyDisposedItemByUserIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlreadyDisposedItemByUserIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
