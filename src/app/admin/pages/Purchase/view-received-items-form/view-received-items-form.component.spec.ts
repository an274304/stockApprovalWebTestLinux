import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReceivedItemsFormComponent } from './view-received-items-form.component';

describe('ViewReceivedItemsFormComponent', () => {
  let component: ViewReceivedItemsFormComponent;
  let fixture: ComponentFixture<ViewReceivedItemsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewReceivedItemsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReceivedItemsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
