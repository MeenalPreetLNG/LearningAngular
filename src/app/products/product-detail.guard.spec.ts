import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductDetailGuard } from './product-detail.guard';

describe('ProductDetailGuard', () => {
  let guard: ProductDetailGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports :[RouterTestingModule]
    });
    guard = TestBed.inject(ProductDetailGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });



});