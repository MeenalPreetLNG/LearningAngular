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

  constructor(private formBuilder: FormBuilder,
              private customerService: CustomerServiceService) { }

  locations = ['London', 'New York', 'Sydeny']

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      Name: ['',[
        Validators.required,
        Validators.minLength(3)
      ]],
      Email: ['', [
        Validators.required,
        Validators.email
      ]],
      Location: [this.locations[0], Validators.required]
    });
  }

  save(): void {
   // console.log('Saved: ' + JSON.stringify(this.customerForm?.value));
    this.customer = Object.assign(this.customer, this.customerForm?.value);
    this.customerForm.reset();

    this.addCustomer(this.customer);
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

}
