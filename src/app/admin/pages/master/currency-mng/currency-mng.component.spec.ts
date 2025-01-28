import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyMngComponent } from './currency-mng.component';

describe('CurrencyMngComponent', () => {
  let component: CurrencyMngComponent;
  let fixture: ComponentFixture<CurrencyMngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyMngComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
