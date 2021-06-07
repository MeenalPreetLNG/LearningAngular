import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  getCountries(): Observable<string[]>{
    return of(['London','Sydney', 'New York']);
  }


 allCustomers(): Observable<string[]> {
  let customers = JSON.parse(localStorage.getItem("User") || '{}');
  console.log("Customers");
  console.log(customers);
  return of(customers);
}

 addCustomer(customer: string):Observable<any> {
  localStorage.setItem("User", customer)
  return  of(customer)
 }

  public setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }
    
  public getItem(key: string){ 
    return localStorage.getItem(key)
  }
 
  public clear(){
    localStorage.clear(); 
  }
}
