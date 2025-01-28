import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedServiceComponent } from './approved-service.component';

describe('ApprovedServiceComponent', () => {
  let component: ApprovedServiceComponent;
  let fixture: ComponentFixture<ApprovedServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
