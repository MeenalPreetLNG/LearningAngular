import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IBooks } from './books';
import { BooksService } from './books.service';

@Component({
  selector: 'pm-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  listOfBooks: IBooks[] = [];
  errorMessage = '';
  sub!: Subscription;
  bookForm!: FormGroup;
  book!: IBooks;

  constructor(private booksService: BooksService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.bookForm  = this.formBuilder.group({
      Title: ['', Validators.required],
      Author: ['', Validators.required],
      Description: ['', Validators.required],
      Id: ''
    });
   
    this.sub =   this.booksService.getBooks().subscribe({
      next: customers => {
          this.listOfBooks = customers
      },
      error: err => this.errorMessage = err
    });

    this.route.paramMap.subscribe(parameterMap => {
      const customerCode = Number(this.route.snapshot.paramMap.get('id'));
      this.getBook(customerCode);
    })


  }

  getBook(id: number){
    if(id === 0){
      this.bookForm.reset();
    }else{
      
      this.booksService.GetBookApi(id).subscribe({
        next: customers => {
          this.book = customers 
          this.bookForm.patchValue({
            Title: this.book.title,
            Author: this.book.author,
            Description: this.book.description,
            Id: this.book.id
           })
        },
        error: err => this.errorMessage = err
      })    
    }
  }

  deleteBook(id: number): void{
    let index;
    this.booksService.deleteBook(id).subscribe({
      next: customers => {
        index = this.listOfBooks.findIndex(data => data.id == customers.id);
        this.listOfBooks.splice(index,1);
      },
      error: err => this.errorMessage = err
    })
  
  }

  save(): void{
    alert("Saved Called");
    var Id = this.bookForm?.value.Id;  
    var bookForm =  this.bookForm?.value;
    
    console.log("Id" + Id);
    console.log(bookForm);
    if(Id === 0){
      this.addBook(bookForm);
      this.bookForm.reset();
    }else{
      this.editBook(Id, bookForm);
      this.bookForm.reset();
      this.router.navigate(['books/0']);
    }

  }

  ngOnDestory(){
    if (this.sub) {
      this.sub.unsubscribe();
    }
}

  addBook(bookForm: IBooks){
    this.sub =   this.booksService.AddBook(bookForm).subscribe({
      next: customers => {
        this.listOfBooks.push(customers);
      },
      error: err => this.errorMessage = err
    });
  }

  editBook(Id: number,bookForm: IBooks){
   // alert("Id " + Id + " -- Book " + bookForm);
    this.sub =   this.booksService.EditBook(Id, bookForm).subscribe({
      next: customers => {
      //  this.listOfBooks.push(customers);
      console.log("Edited");
      console.log(customers);
      let index = this.listOfBooks.findIndex(data => data.id == customers.id);
  
  
      this.listOfBooks[index] = customers;
      console.log(this.listOfBooks);
      },
      error: err => this.errorMessage = err
    });
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
  }

}




