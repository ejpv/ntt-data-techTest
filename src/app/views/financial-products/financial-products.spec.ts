import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProducts } from './financial-products';

describe('FinancialProducts', () => {
  let component: FinancialProducts;
  let fixture: ComponentFixture<FinancialProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
