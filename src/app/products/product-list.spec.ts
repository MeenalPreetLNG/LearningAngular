import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule, Routes } from "@angular/router";
import { of } from "rxjs";
import { IProduct } from "./product";
import { ProductDetailComponent } from "./product-detail.component";
import { ProductDetailGuard } from "./product-detail.guard";
import { ProductListComponent } from "./product-list.component";
import { ProductService } from "./product-list.services";
import { Location } from '@angular/common';
import { DebugElement } from "@angular/core";


describe("Product Details",() => {


  const routes: Routes = [
    { path: 'products', component: ProductListComponent },
      {
        path: 'products/:id',
        canActivate: [ProductDetailGuard],
        component: ProductDetailComponent
       },
  ];


    let component: ProductListComponent;
    let PRODUCTS: IProduct[];
    let mockHerosService;
    let fixture: ComponentFixture<ProductListComponent>;
    let mockHttpClient: HttpClient;
    let service: ProductService

    let router: Router;
    let debugElement: DebugElement;
    let location: Location;


    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ ProductListComponent ],
        imports :[  RouterModule.forRoot(routes),
                    HttpClientModule,
                    HttpClientTestingModule,
                    FormsModule]
      })
      .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      service = new ProductService(mockHttpClient);


      router = TestBed.inject(Router);
      location = TestBed.inject(Location);
      debugElement = fixture.debugElement;
      router.initialNavigation();
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
            expect(component.filetredProducts.length).toBe(1);
        } )

        it('should not diplay any product if productName does not match any', () => {
            component.products = PRODUCTS;
            component.filetredProducts = component.performFilter('YGD');
            expect(component.filetredProducts.length).toBe(0);
        })

        it('should not diplay any product if productName does not match any', () => {
            component.products = PRODUCTS;
            component.filetredProducts = component.performFilter('YGD');
            expect(component.filetredProducts.length).toBe(0);
        })
    })


    describe(`Obeservble`, () => {

      it(`Get all products`, () => {
        let response: IProduct[] = [];
        spyOn(service, 'getProducts').and.returnValue(of(PRODUCTS));
        service.getProducts().subscribe(res => response = res);
        expect(response).toEqual(PRODUCTS);
      })

      it(`Return a particular Id`, () =>{
        let response: IProduct | undefined;
        spyOn(service, 'getProduct').and.returnValue(of(PRODUCTS[1]));
        service.getProduct(1).subscribe(res => response = res);
        expect(response).toEqual(PRODUCTS[1]);
      })

    })


    describe(`Re-direct to Products link`, () => {

      it('should test redirection to default to products', fakeAsync(() => {
        router.navigate(['products']);
        tick();
        expect(location.path()).toBe('/products');
      }));


      it('should to products if id > 1', fakeAsync(() => {
        const id = PRODUCTS[1].productId;
        const path = '/products/' + 0;
        router.navigate([path]);
        tick();


        expect(location.path()).toBe('/products');
      }));

    })



})

