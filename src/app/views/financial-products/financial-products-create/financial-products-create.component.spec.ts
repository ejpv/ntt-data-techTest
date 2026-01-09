import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProductsCreateComponent } from './financial-products-create.component';

describe('FinancialProductsCreateComponent', () => {
  let component: FinancialProductsCreateComponent;
  let fixture: ComponentFixture<FinancialProductsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProductsCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProductsCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
