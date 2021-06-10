import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IProduct } from "./product";
import { ProductService } from "./product-list.services";

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})


export class ProductListComponent implements OnInit {

  pageTitle: string = "Product List!!";
  imageWidth: number = 50;
  imageMargin: number = 2;
  showImage: boolean = false;
  errorMessage: string = '';
  sub!: Subscription;
  filetredProducts: IProduct[] = [];
  products: IProduct[] = [];

  constructor(private productService: ProductService) { }

  private _listFilter: string = '';

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    console.log("In Setter", value);
    this.filetredProducts = this.performFilter(value);
  }

  performFilter(filterBy: string): IProduct[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter((product: IProduct) =>
      product.productName.toLocaleLowerCase().includes(filterBy));
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  ngOnInit(): void {
    // this.sub =   this.productService.getProducts().subscribe({
    //   next: products => {
    //     this.products  = products;
    //     this.filetredProducts = this.products;
    //   },
    //   error: err => this.errorMessage = err
    // });

    this.sub = this.productService.getProductsFromSession().subscribe({
      next: products => {
        this.products = products;
        this.filetredProducts = this.products;
      },
      error: err => this.errorMessage = err
    });
    console.log(this.products);
  }

  ngOnDestory() {
    this.sub.unsubscribe();
  }
}