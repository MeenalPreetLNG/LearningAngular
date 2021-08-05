import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksComponent } from './books.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BooksComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { 
        path: 'books/:id', 
        component: BooksComponent 
      }
    ]),
    ReactiveFormsModule
  ]
})
export class BooksModule { }
