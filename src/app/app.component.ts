

import { Component, OnInit } from "@angular/core";
import { IProduct } from "./products/product";
import { IStudent } from "./students/student";

@Component({
  selector: 'pm-root',
  template: `
    <nav class='navbar navbar-expand navbar-light bg-light'>
       <a class='navbar-brand'> {{ pageTitle }} </a>
       <ul class='nav nav-pills'>
          <li><a class='nav-link' routerLink='/welcome'>Home</a></li>
          <li><a class='nav-link' routerLink='/products'>Product List</a></li>
          <li><a class='nav-link' routerLink='/students'>Student Section</a></li>
       </ul>
    </nav>
    <div class='container'>
       <router-outlet></router-outlet>
    </div>
    
  `
})

export class AppComponent implements OnInit {
  pageTitle: string = 'learn'
  studentData: IStudent[] = [{
      "FirstName": "ABC",
      "LastName": "XYZ",
      "FormNo": "123456",
      "Email": "abc@gmail.com",
      "Course": "MCA"
    },
    {
      "FirstName": "erg",
      "LastName": "eraear",
      "FormNo": "45747",
      "Email": "abc@gmail.com",
      "Course": "MCA"
    },
    {
      "FirstName": "aerug",
      "LastName": "earug",
      "FormNo": "25235",
      "Email": "sgfg@gmail.com",
      "Course": "MCA"
    }]
  productData : IProduct[] = [
    {
      "productId": 1,
      "productName": "Leaf Rake",
      "productCode": "GDN-0011",
      "releaseDate": "March 19, 2021",
      "description": "Leaf rake with 48-inch wooden handle.",
      "price": 19.95,
      "starRating": 3.2,
      "imageUrl": "assets/images/leaf_rake.png"
    },
    {
      "productId": 2,
      "productName": "Garden Cart",
      "productCode": "GDN-0023",
      "releaseDate": "March 18, 2021",
      "description": "15 gallon capacity rolling garden cart",
      "price": 32.99,
      "starRating": 4.2,
      "imageUrl": "assets/images/garden_cart.png"
    },
    {
      "productId": 5,
      "productName": "Hammer",
      "productCode": "TBX-0048",
      "releaseDate": "May 21, 2021",
      "description": "Curved claw steel hammer",
      "price": 8.9,
      "starRating": 4.8,
      "imageUrl": "assets/images/hammer.png"
    },
    {
      "productId": 8,
      "productName": "Saw",
      "productCode": "TBX-0022",
      "releaseDate": "May 15, 2021",
      "description": "15-inch steel blade hand saw",
      "price": 11.55,
      "starRating": 3.7,
      "imageUrl": "assets/images/saw.png"
    },
    {
      "productId": 10,
      "productName": "Video Game Controller",
      "productCode": "GMG-0042",
      "releaseDate": "October 15, 2020",
      "description": "Standard two-button video game controller",
      "price": 35.95,
      "starRating": 4.6,
      "imageUrl": "assets/images/xbox-controller.png"
    }
  ]

  ngOnInit(): void {
    if(sessionStorage.getItem('students') == null)
      sessionStorage.setItem('students', JSON.stringify(this.studentData));

      if(sessionStorage.getItem('products') == null)
      sessionStorage.setItem('products', JSON.stringify(this.studentData));
  }

  ngOnDestroy(): void{
    sessionStorage.removeItem('students');
    sessionStorage.removeItem('products');
    console.log('session item removed');
  }
}