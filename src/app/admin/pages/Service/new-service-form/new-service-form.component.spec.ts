import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewServiceFormComponent } from './new-service-form.component';

describe('NewServiceFormComponent', () => {
  let component: NewServiceFormComponent;
  let fixture: ComponentFixture<NewServiceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewServiceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
