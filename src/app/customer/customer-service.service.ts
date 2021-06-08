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

  getLevels(): Observable<string[]>{
    return of(['Level-1','Level-2', 'Level-3','Level-4','Level-5']);
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
}
