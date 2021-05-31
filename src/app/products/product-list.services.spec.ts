import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { IProduct } from "./product";
import { ProductService } from "./product-list.services"

describe("ProductService", () => {
    let productService: ProductService;
    let mockHttpClient: HttpClient;
    beforeEach(() => {
        productService = new ProductService(mockHttpClient);



    });

    it('should return products data', () => {

        let mockResponse: IProduct[] = [
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
        ];
        let response: IProduct[] = [];

        spyOn(productService, 'getProducts').and.returnValue(of(mockResponse));

        productService.getProducts().subscribe(res => response = res);

        expect(response).toEqual(mockResponse);
    })

    it('should return product by id', () => {
        let mockResponse: IProduct = {
            "productId": 1,
            "productName": "Leaf Rake",
            "productCode": "GDN-0011",
            "releaseDate": "March 19, 2021",
            "description": "Leaf rake with 48-inch wooden handle.",
            "price": 19.95,
            "starRating": 3.2,
            "imageUrl": "assets/images/leaf_rake.png"
        };

        let response: IProduct | undefined;

        spyOn(productService, 'getProduct').and.returnValue(of(mockResponse));
        productService.getProduct(1).subscribe(res => response = res);

        expect(response).toEqual(mockResponse);
    })
})