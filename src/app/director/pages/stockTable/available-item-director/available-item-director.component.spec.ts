import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableItemDirectorComponent } from './available-item-director.component';

describe('AvailableItemDirectorComponent', () => {
  let component: AvailableItemDirectorComponent;
  let fixture: ComponentFixture<AvailableItemDirectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableItemDirectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableItemDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
