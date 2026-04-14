import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsAndServices } from './products-and-services';

describe('ProductsAndServices', () => {
  let component: ProductsAndServices;
  let fixture: ComponentFixture<ProductsAndServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsAndServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsAndServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
