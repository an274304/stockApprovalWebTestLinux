import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDirectorComponent } from './dashboard-director.component';

describe('DashboardDirectorComponent', () => {
  let component: DashboardDirectorComponent;
  let fixture: ComponentFixture<DashboardDirectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDirectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
