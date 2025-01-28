import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServicePendingComponent } from './view-service-pending.component';

describe('ViewServicePendingComponent', () => {
  let component: ViewServicePendingComponent;
  let fixture: ComponentFixture<ViewServicePendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewServicePendingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewServicePendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
