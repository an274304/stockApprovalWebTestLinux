import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentMngComponent } from './department-mng.component';

describe('DepartmentMngComponent', () => {
  let component: DepartmentMngComponent;
  let fixture: ComponentFixture<DepartmentMngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentMngComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
