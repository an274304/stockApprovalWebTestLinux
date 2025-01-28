import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMngComponent } from './category-mng.component';

describe('CategoryMngComponent', () => {
  let component: CategoryMngComponent;
  let fixture: ComponentFixture<CategoryMngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryMngComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
