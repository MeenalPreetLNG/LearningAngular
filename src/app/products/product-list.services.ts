import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError, of } from "rxjs";
import { IProduct } from "./product";
import { catchError, map, tap } from 'rxjs/operators';

 
@Injectable({
    providedIn: 'root'
})
export class ProductService{

    private productUrl = 'api/products/product.json'

    constructor(private http: HttpClient) {}

    getProducts(): Observable<IProduct[]> {
        debugger;
        let products : Observable<IProduct[]> =  of(JSON.parse(localStorage.getItem("my-products") || '{}'));
        if(products == null)
        {
            products = this.http.get<IProduct[]>(this.productUrl);
            localStorage.setItem("my-products",JSON.stringify(products));
        }
     return  products.pipe(
        tap(data =>  localStorage.setItem("my-products",JSON.stringify(data))),
        catchError(this.handleError)
         );
    }


    getProduct(id: number): Observable<IProduct | undefined> {
        return this.getProducts()
        .pipe(
            map((products: IProduct[]) => products.find(p => p.id === id))
        );
    }

    createOrUpdateProduct(product: IProduct): Observable<IProduct> {
        debugger;
        var products : IProduct[] = localStorage.getItem("my-products")!=null ?  JSON.parse(localStorage.getItem("my-products") || '[]') : '[]';
        if(product.id==0)
        {
         product.id= products.length>0 ? products[products.length - 1].id+1 : 1;
         products.push(product);
        }
        else{
            let index = products.indexOf(products.find(t=>t.id==product.id) as IProduct);
            products[index] = product;
        }
        localStorage.setItem("my-products",JSON.stringify(products));

        return  of(product)
          .pipe(
            tap(data => console.log('createProduct: ' + JSON.stringify(data))),
            catchError(this.handleError)
          );
      }

      deleteProduct(id : Number) : Observable<{}>{
          debugger;
        var products : IProduct[] = localStorage.getItem("my-products")!=null ?  JSON.parse(localStorage.getItem("my-products") || '[]') : '[]';
        let index = products.indexOf(products.find(t=>t.id==id) as IProduct);
        products.splice(index,1);
        localStorage.setItem("my-products",JSON.stringify(products));
        return new  Observable();
      }
    

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if(err.error instanceof ErrorEvent){
            errorMessage = `An error occured : ${err.error.message}`;
        } else {
            errorMessage = `Server returned code : ${err.status}, error message is: ${err.message}`;
        }

        console.error(errorMessage);
        return throwError(errorMessage);
    }
}