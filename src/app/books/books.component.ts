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

  constructor(private booksService: BooksService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.bookForm  = this.formBuilder.group({
      Title: ['', Validators.required],
      Author: ['', Validators.required],
      Description: ['', Validators.required]
    });
   
    this.sub =   this.booksService.getBooks().subscribe({
      next: customers => {
          this.listOfBooks = customers
      },
      error: err => this.errorMessage = err
    });
  }

 

  deleteBook(id: number): void{

    this.booksService.deleteBook(id).subscribe({
      next: customers => {
        console.log("On Delete");
        console.log(customers);
      },
      error: err => this.errorMessage = err
    })
  
  }

  save(): void{
    var bookForm =  this.bookForm?.value;  
    this.addBook(bookForm);
    this.bookForm.reset();
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

}




