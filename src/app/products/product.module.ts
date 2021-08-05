import { NgModule } from '@angular/core';
import { ProductListComponent } from './product-list.component';
import { ProductDetailComponent } from './product-detail.component';
import { RouterModule } from '@angular/router';
import { ProductDetailGuard } from './product-detail.guard';
import { SharedModule } from '../shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { EditProductComponent } from './edit-product.component';
import { ProductEditGuard } from './edit-product.guard';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    EditProductComponent
  ],
  imports: [
    DataTablesModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'products', component: ProductListComponent },
      { 
        path: 'products/:id', 
        canActivate: [ProductDetailGuard],
        component: ProductDetailComponent
       },
       {
        path: 'products/:id/edit',
        canDeactivate: [ProductEditGuard],
        component: EditProductComponent
      },
    ]),
    SharedModule
  ]
})
export class ProductModule { }
