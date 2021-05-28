import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule, Routes } from "@angular/router";
import { IProduct } from "./product";
import { ProductDetailComponent } from "./product-detail.component";
import { ProductDetailGuard } from "./product-detail.guard";
import { ProductListComponent } from "./product-list.component";


describe("Product Details",() => {
    let component: ProductListComponent;
    let PRODUCTS: IProduct[];
    let mockHerosService;
    let fixture: ComponentFixture<ProductListComponent>;
  
    const routes: Routes = [
        { path: 'products', component: ProductListComponent },
          { 
            path: 'products/:id', 
            canActivate: [ProductDetailGuard],
            component: ProductDetailComponent
           },
      ];
   
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ ProductListComponent ],
        imports :[ RouterModule.forRoot(routes),
            HttpClientModule,
            HttpClientTestingModule]
      })
      .compileComponents();
    });
  
    beforeEach(() => {
      fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });


    beforeEach(() => {
        PRODUCTS =  [
            {
                "productId": 1,
                "productName": "Leaf Rake",
                "productCode": "GDN-0011",
                "releaseDate": "March 19, 2021",
                "description": "Leaf rake with 48-inch wooden handle.",
                "price": 19.95,
                "starRating": 3.2,
                "imageUrl": "assets/images/leaf_rake.png"
              },
              {
                "productId": 2,
                "productName": "Garden Cart",
                "productCode": "GDN-0023",
                "releaseDate": "March 18, 2021",
                "description": "15 gallon capacity rolling garden cart",
                "price": 32.99,
                "starRating": 4.2,
                "imageUrl": "assets/images/garden_cart.png"
              },
              {
                "productId": 5,
                "productName": "Hammer",
                "productCode": "TBX-0048",
                "releaseDate": "May 21, 2021",
                "description": "Curved claw steel hammer",
                "price": 8.9,
                "starRating": 4.8,
                "imageUrl": "assets/images/hammer.png"
              }
        ]
    
    })
    
    
    mockHerosService = jasmine.createSpyObj(['listFilter','performFilter','getProducts','getProduct'])
   
    component = new ProductListComponent(mockHerosService);

    describe("List Filter ", () => {
        it('should display all properties by default', () => {
            component.products = PRODUCTS;
            component.listFilter;
            expect(component.products.length).toBe(3);
        })

        it('should filter products by paased products by productName ', () => {
            component.products = PRODUCTS;
            component.filetredProducts = component.performFilter('L');
            console.log(component.products);
            expect(component.filetredProducts.length).toBe(1);
        } )

        it('should not diplay any product if productName does not match any', () => {
            component.products = PRODUCTS;
            component.filetredProducts = component.performFilter('YGD');
            console.log(component.products);
            expect(component.filetredProducts.length).toBe(0);
        })

       
    })
})

