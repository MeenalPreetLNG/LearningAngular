import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { CustomerServiceService } from './customer-service.service';


@Component({
  selector: 'pm-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm!: FormGroup;
  customer: any = {};
  listOfCustomers: any = [];
  loading: boolean = true;
  sub!: Subscription;
  errorMessage: string = '';
  countries!: Observable<string[]>;


  constructor(private formBuilder: FormBuilder,
              private customerService: CustomerServiceService) { }


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
      Location: ['', Validators.required]
    });


    this.sub =   this.customerService.allCustomers().subscribe({
      next: customers => {
        debugger;
        this.listOfCustomers  = customers;
        debugger;
      },
      error: err => this.errorMessage = err
    });
    
  
    this.countries = this.customerService.getCountries();
  }



  save(): void {
    this.customerForm.patchValue({
      CustomerCode: Date.now()
    })
    this.customer = Object.assign(this.customer, this.customerForm?.value);
    this.addCustomer(this.customer);
    this.customerForm.reset();

    this.sub =   this.customerService.allCustomers().subscribe({
      next: customers => {
        this.listOfCustomers  = customers;
      },
      error: err => this.errorMessage = err
    });
   
  }

  addCustomer(customer: any[] | FormGroup){
    let customers = [];
    if(localStorage.getItem('User')){
      customers = JSON.parse(localStorage.getItem("User") || '{}');
      customers = [customer,...customers];
    }else{
      customers = [customer]
    }
   
    this.sub = this.customerService.addCustomer(JSON.stringify(customers))
      .subscribe(data => {
        console.log(data);
      });
  }

  deleteCustomer(customerCode: any){
    let AllCustomers = [];
    AllCustomers = JSON.parse(localStorage.getItem("User") || '{}');
    let filteredPeople = AllCustomers.filter((item: { CustomerCode: Date; }) => item.CustomerCode !== customerCode);
    
    this.sub = this.customerService.addCustomer(JSON.stringify(filteredPeople))
      .subscribe(data => {
        console.log(data);
      });
    this.listOfCustomers = filteredPeople;
  }


  deleteAllCustomer(){
    this.customerService.clear();
    this.listOfCustomers =  JSON.parse(localStorage.getItem("User") || '{}');
  }
  
  ngOnDestory(){
      this.sub.unsubscribe();
  }

}
