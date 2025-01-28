import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingServiceComponent } from './pending-service.component';

describe('PendingServiceComponent', () => {
  let component: PendingServiceComponent;
  let fixture: ComponentFixture<PendingServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
