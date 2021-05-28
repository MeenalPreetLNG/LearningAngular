import { IProduct } from "./product";
import { ProductListComponent } from "./product-list.component";


describe("Product Details",() => {
    let component: ProductListComponent;
    let PRODUCTS: IProduct[];
    let mockHerosService;

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