import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { IProduct } from "./product";
import { ProductService } from "./product-list.services";

@Component({
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})


export class ProductListComponent implements OnInit { 

    pageTitle: string = "Product List!!";
    imageWidth: number =  50;
    imageMargin: number = 2;
    showImage: boolean = false;
    errorMessage: string = '';
    sub!: Subscription;
    filetredProducts: IProduct[] = [];
    products: IProduct[] = [];

    constructor(private productService: ProductService,private router : Router){}
 
    private _listFilter: string = '';

    get listFilter(): string{
      return this._listFilter;
    }

    set listFilter(value: string){
      this._listFilter = value;
      this.filetredProducts = this.performFilter(value);
    }

    performFilter(filterBy: string): IProduct[]{
        filterBy = filterBy.toLocaleLowerCase();
        return this.products.filter((product: IProduct) => 
            product.productName.toLocaleLowerCase().includes(filterBy));
    }

    toggleImage(): void{
        this.showImage = !this.showImage;
    }

    ngOnInit(): void{
      this.getProducts();
    }

    ngAfterViewInit(): void {
    }

    getProducts():void{
      this.sub =   this.productService.getProducts().subscribe({
        next: products => {
          this.products  = products;
          this.filetredProducts = this.products;
        },
        error: err => this.errorMessage = err
      });
    }
    ngOnDestory(){
        this.sub.unsubscribe();
    }

    deleteProduct(id : Number) : void {
      if (id === 0) {
        // Don't delete, it was never saved.
        this.onSaveComplete();
      } else {
        if (confirm(`Are you sure you want to delete this product?`)) {
          this.productService.deleteProduct(id)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: (err: string) => this.errorMessage = err
            });
        }
      }
    }

    onSaveComplete() : void{
      this.getProducts();
    }
}