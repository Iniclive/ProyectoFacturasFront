import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductServiceDetails } from './product-service-details';

describe('ProductServiceDetails', () => {
  let component: ProductServiceDetails;
  let fixture: ComponentFixture<ProductServiceDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductServiceDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductServiceDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
