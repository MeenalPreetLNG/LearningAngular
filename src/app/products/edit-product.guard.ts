import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

import { EditProductComponent } from './edit-product.component';

@Injectable({
  providedIn: 'root'
})
export class ProductEditGuard implements CanDeactivate<EditProductComponent> {
  canDeactivate(component: EditProductComponent): Observable<boolean> | Promise<boolean> | boolean {
    if (component.productForm.dirty) {
      const productName = component.productForm.get('productName')?.value || 'New Product';
      return confirm(`Navigate away and lose all changes to ${productName}?`);
    }
    return true;
  }
}