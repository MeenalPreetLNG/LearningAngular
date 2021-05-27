import { IProduct } from "./product";
import { ProductListComponent } from "./product-list.component"

describe('ProductListComponent', () => {
    let component : ProductListComponent;
    let products: IProduct[];
    let mockProductService;

    beforeEach(() => {
        products = [
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
              }
        ]

        mockProductService = jasmine.createSpyObj(['getProducts','getProduct']);
        component = new ProductListComponent(mockProductService);
    })

    describe('performFilter', () => {
        it('should have atleast one value', () => {
            component.products = products;

            component.products = component.performFilter('a');

            expect(component.products.length).toBeGreaterThanOrEqual(1);
        })

        it('might contain blank also', () => {
            component.products = products;

            component.products = component.performFilter('abc');

            expect(component.products.length).toBe(0);
        })
    })
})