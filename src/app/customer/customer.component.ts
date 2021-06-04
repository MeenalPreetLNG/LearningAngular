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
      CustomerCode: Date.now(),
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
   // console.log('Saved: ' + JSON.stringify(this.customerForm?.value));
    this.customer = Object.assign(this.customer, this.customerForm?.value);
    this.customerForm.reset();
    
    this.addCustomer(this.customer);
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

  deleteCustomer(id: number){
    let AllCustomers = [];
    let AfterRemoval = [];
    AllCustomers = JSON.parse(localStorage.getItem("User") || '{}');
    AfterRemoval = AllCustomers.splice(id, 1);
    localStorage.setItem("User", JSON.stringify(AllCustomers));
    this.listOfCustomers = AllCustomers;
  }


  deleteAllCustomer(){
    localStorage.clear();
    this.listOfCustomers =  JSON.parse(localStorage.getItem("User") || '{}');
  }
  

}
