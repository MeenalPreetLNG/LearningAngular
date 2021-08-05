import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GenericValidator } from '../shared/generic-validator';
import { NumberValidators } from '../shared/number.validator';
import { IProduct } from './product';
import { ProductService } from './product-list.services';

@Component({
  selector: 'pm-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit,AfterViewInit , OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  pageTitle = 'Add Product';
  errorMessage!: string;
  productForm!: FormGroup;
  product!: IProduct;
  private subscribeProduct!: Subscription;
  private subscribeCountry!: Subscription;
   id : Number =0;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator! : GenericValidator;
  countries :any[] =[];

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private productService : ProductService) {
    this.validationMessages = {
    productName: {
      required: 'Product name is required.',
      minlength: 'Product name must be at least three characters.',
      maxlength: 'Product name cannot exceed 50 characters.'
    },
    productCode: {
      required: 'Product code is required.'
    },
    starRating: {
      range: 'Rate the product between 1 (lowest) and 5 (highest).'
    },
    price: {
      required: 'Price is required',
      range: 'Price of the product between 1 (lowest) and 5 (highest).'
    },
    country: {
      required: 'Country is required.'
    }
  };

  // Define an instance of the validator for use with this form,
  // passing in this form's set of validation messages.
  this.genericValidator = new GenericValidator(this.validationMessages);
}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required,
                         Validators.minLength(3),
                         Validators.maxLength(50)]],
      productCode: ['', Validators.required],
      starRating: ['', NumberValidators.range(1, 5)],
      tags: this.fb.array([]),
      description: '',
      productType :['Type1',Validators.required],
      country:['',Validators.required],
      price:['',[Validators.required,NumberValidators.range(1,1000)]],
    });

    this.subscribeProduct = this.route.paramMap.subscribe(
      params => {
       this.id = +Number(params.get('id'));
        this.getProduct();
      }
    );
    this.subscribeCountry =   this.productService.getCountries().subscribe({
      next: countries => {
        this.countries  = countries;
      },
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.subscribeProduct.unsubscribe();
    this.subscribeCountry.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.productForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.productForm);
    });
  }

  getProduct(): void {
    if(this.id >0)
    {
    let products : IProduct[] =JSON.parse(localStorage.getItem("my-products") || '{}');
    if(products!=null && products.length!=0 && products.length!=undefined)
    {
      this.product = products.find(t=>t.id==this.id)!;
      // Update the data on the form
    this.productForm.patchValue({
      productName: this.product.productName,
      productCode: this.product.productCode,
      starRating: this.product.starRating,
      description: this.product.description,
      country :this.product.country,
      price : this.product.price,
      productType: (this.product.productType) ? 'Type1' : this.product.productType
    });
    }
    this.pageTitle = `Edit Product: ${this.product.productName}`;
  }
  }

  saveProduct() : void{
    if (this.productForm.valid) {
      if (this.productForm.dirty) {
        const p = { ...this.product, ...this.productForm.value };
        p.id=Number(this.id);
          this.productService.createOrUpdateProduct(p)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: (err: string) => this.errorMessage = err
            });
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete() : void{
    this.productForm.reset();
    this.router.navigate(['/products']);
  }
}
