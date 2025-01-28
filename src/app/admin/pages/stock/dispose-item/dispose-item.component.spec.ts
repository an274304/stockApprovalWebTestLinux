import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposeItemComponent } from './dispose-item.component';

describe('DisposeItemComponent', () => {
  let component: DisposeItemComponent;
  let fixture: ComponentFixture<DisposeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisposeItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisposeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
