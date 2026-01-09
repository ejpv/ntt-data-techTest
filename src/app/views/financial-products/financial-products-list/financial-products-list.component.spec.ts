import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProductsListComponent } from './financial-products-list.component';

describe('FinancialProductsListComponent', () => {
  let component: FinancialProductsListComponent;
  let fixture: ComponentFixture<FinancialProductsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialProductsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialProductsListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
