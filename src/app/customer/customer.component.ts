import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  countries: string[] = ['London', 'New York', 'Sydeny']

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

    this.listOfCustomers =  JSON.parse(localStorage.getItem("User") || '{}');
  }

  save(): void {
    this.customerForm.patchValue({
      CustomerCode: Date.now()
    })
    this.customer = Object.assign(this.customer, this.customerForm?.value);

   
    this.addCustomer(this.customer);
    this.customerForm.reset();
    this.listOfCustomers =  JSON.parse(localStorage.getItem("User") || '{}');
  }

  addCustomer(customer: any[] | FormGroup){
    console.log("---Here----")
    
    let customers = [];
    if(localStorage.getItem('User')){
      customers = JSON.parse(localStorage.getItem("User") || '{}');
      customers = [customer,...customers];
    }else{
      customers = [customer]
    }
    localStorage.setItem("User", JSON.stringify(customers));
    
  }

  deleteCustomer(cutomerCode: any){
    console.log("---Remove----");
    console.log(cutomerCode);
    let AllCustomers = [];
    AllCustomers = JSON.parse(localStorage.getItem("User") || '{}');
    console.log("---All Customers----");
    console.log(AllCustomers);

    let filteredPeople = AllCustomers.filter((item: { CustomerCode: Date; }) => item.CustomerCode !== cutomerCode);
    console.log("---Filtered Customers----");
    console.log(filteredPeople);

    localStorage.setItem("User", JSON.stringify(filteredPeople));
    this.listOfCustomers = filteredPeople;
  }


  deleteAllCustomer(){
    localStorage.clear();
    this.listOfCustomers =  JSON.parse(localStorage.getItem("User") || '{}');
  }
  

}
