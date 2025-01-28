import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchMngComponent } from './branch-mng.component';

describe('BranchMngComponent', () => {
  let component: BranchMngComponent;
  let fixture: ComponentFixture<BranchMngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchMngComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
