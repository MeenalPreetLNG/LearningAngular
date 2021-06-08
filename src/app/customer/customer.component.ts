import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table/table';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { ICustomer } from './customer';
import { CustomerServiceService } from './customer-service.service';


@Component({
  selector: 'pm-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm!: FormGroup;
  customer!: ICustomer;
  listOfCustomers: any = [];
  loading: boolean = true;
  sub!: Subscription;
  errorMessage: string = '';
  countries!: Observable<string[]>;
  levels!: Observable<string[]>;
  @ViewChild('dt') dt: Table | undefined;


  constructor(private formBuilder: FormBuilder,
              private customerService: CustomerServiceService,
              private router: Router,
              private route: ActivatedRoute) { }

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
  }

  save(): void {
    var custmerCode =  this.customerForm?.value.CustomerCode;  

    if(custmerCode === null || custmerCode === ""){
      this.customerForm.patchValue({
        CustomerCode: Date.now()
      })
      this.customer = this.customerForm?.value;
      this.addCustomer(this.customer);
      this.customerForm.reset();
    }else{
      this.deleteCustomer(custmerCode);
      this.customer = this.customerForm?.value;
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
    debugger
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

}

