import { ViewChildren } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table/table';
import { merge } from 'rxjs';
import { fromEvent } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { debounceTime } from 'rxjs/operators';
import { GenericValidator } from '../shared/generic-validator';
import { ICustomer } from './customer';
import { CustomerServiceService } from './customer-service.service';


@Component({
  selector: 'pm-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  customerForm!: FormGroup;
  customer!: ICustomer;
  listOfCustomers: any = [];
  loading: boolean = true;
  sub!: Subscription;
  errorMessage: string = '';
  countries!: Observable<string[]>;
  levels!: Observable<string[]>;
  @ViewChild('dt') dt: Table | undefined;

  emailMessage: string = "";

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator! : GenericValidator;
 // formInputElements: any;
  


  constructor(private formBuilder: FormBuilder,
    private customerService: CustomerServiceService,
    private router: Router,
    private route: ActivatedRoute) {
      this.validationMessages = {
        Name: {
          required: 'Product name is required.',
          minlength: 'Product name must be at least three characters.',
        },
        Location: {
          required: 'Please select the Location.'
        },
        Level: {
          required: 'Please select the Level.'
        },
        Email:{
          required: 'Please enter a email.',
          email: 'Please enter a valid email.',
        }

      };
    
      
      this.genericValidator = new GenericValidator(this.validationMessages);
     }

  applyFilterGlobal($event: Event,stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }
  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      CustomerCode: '',
      Name: ['',[
        Validators.required,
        Validators.minLength(3)
      ]],
      Email: ['', [
        Validators.required,
        Validators.email
      ]],
      Location: ['', Validators.required],
      Level: ['', Validators.required],
    });


    this.sub =   this.customerService.allCustomers().subscribe({
      next: customers => {
        this.listOfCustomers  = customers;
      },
      error: err => this.errorMessage = err
    });
    
    this.route.paramMap.subscribe(parameterMap => {
      const customerCode = parameterMap.get('id');
      this.getEmployee(customerCode);
    })
    this.countries = this.customerService.getCountries();
    this.levels =  this.customerService.getLevels();

    
    const emailControl =  this.customerForm.get('Email');
    console.log("Eail - ");
    console.log(emailControl);
    emailControl?.valueChanges.subscribe(
      value => this.setMessage(emailControl)
    );
  }

  save(): void {
    var custmerCode =  this.customerForm?.value.CustomerCode;  
    if(!custmerCode){
      this.customerForm.patchValue({
        CustomerCode: Date.now()
      })

      this.customer = this.customerForm?.value;
      this.addCustomer(this.customer);
      this.customerForm.reset();
    }else{
      this.deleteCustomer(custmerCode);
      this.customer = this.customerForm?.value;
      debugger
      this.addCustomer(this.customer);
      this.customerForm.reset();
      this.router.navigate(['/edit/0',]);
    }
   
    
    this.sub =   this.customerService.allCustomers().subscribe({
      next: customers => {
        this.listOfCustomers  = customers;
      },
      error: err => this.errorMessage = err
    });
   
  }

  addCustomer(customer: ICustomer){
    let customers = [];
    if(localStorage.getItem('User')){
      customers = JSON.parse(localStorage.getItem("User") || '{}');
      customers = [customer,...customers];
    }else{
      customers = [customer]
    }
    this.sub = this.customerService.addCustomer(JSON.stringify(customers))
      .subscribe(data => {
        
    });
  }

  deleteCustomer(customerCode: Date){
    let AllCustomers = [];
    AllCustomers = JSON.parse(localStorage.getItem("User") || '{}');
    let filteredPeople = AllCustomers.filter((item: { CustomerCode: Date; }) => item.CustomerCode !== customerCode);
    
    this.sub = this.customerService.addCustomer(JSON.stringify(filteredPeople))
      .subscribe(data => {
      });
    this.listOfCustomers = filteredPeople;
  }

  private getEmployee(emp: any){
    if(emp == 0){
    this.customerForm.reset();
    }else{
      let AllCustomers = [];
      AllCustomers = JSON.parse(localStorage.getItem("User") || '{}');
      let filteredPeople = AllCustomers.filter(
                          (item: { CustomerCode: Date; }) => item.CustomerCode == emp)[0];
      this.customerForm.patchValue({
        CustomerCode: filteredPeople.CustomerCode,
        Name: filteredPeople.Name,
        Email: filteredPeople.Email,
        Location: filteredPeople.Location,
        Level: filteredPeople.Level
      })
    }
   
  }
  
  ngOnDestory(){
      this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
   //  const controlBlurs: Observable<any>[] = 
     this.formInputElements
       .map((formControl: ElementRef) => 
            fromEvent(formControl.nativeElement, 'blur').subscribe(value =>{
              this.displayMessage = this.genericValidator.processMessages(this.customerForm);
            }));

   (this.customerForm.valueChanges).pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.customerForm);
    });
  }

  
  setMessage(c: AbstractControl): void{
    this.emailMessage = '';
    if((c.touched || c.dirty) && c.errors){
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }


}

