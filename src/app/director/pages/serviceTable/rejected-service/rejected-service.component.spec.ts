import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedServiceComponent } from './rejected-service.component';

describe('RejectedServiceComponent', () => {
  let component: RejectedServiceComponent;
  let fixture: ComponentFixture<RejectedServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
