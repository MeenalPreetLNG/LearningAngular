import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IBooks } from './books';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private baseUrl = 'https://localhost:44370/api'


  constructor(private http: HttpClient) {}

  getBooks(): Observable<IBooks[]> {
   return this.http.get<IBooks[]>(this.baseUrl+"/Books/GetBooks").pipe(
       tap(data => console.log('All', JSON.stringify(data))),
   );
  }

  deleteBook(id: number): Observable<any> {
    console.log("Delete "  + this.baseUrl+"/Books/Delete?id="+id);
    return this.http.delete<IBooks>(this.baseUrl+"/Books/Delete?id="+id);
  }

   AddBook(book: IBooks): Observable<IBooks> {
    return this.http.post<IBooks>(this.baseUrl+"/Books/AddBook", book).pipe(
        tap(data => console.log('All', JSON.stringify(data))),
    );
   }

   EditBook(Id: number, book: IBooks): Observable<IBooks> {
     console.log(this.baseUrl+"/Books/PutBook?id="+Id,book)
    return this.http.put<IBooks>(this.baseUrl+"/Books/PutBook?id="+Id,book).pipe(
        tap(data => console.log('All', JSON.stringify(data))),
    );
   }

   GetBookApi(Id: number): Observable<IBooks> {
   return this.http.get<IBooks>(this.baseUrl+"/Books/GetBook/"+Id).pipe(
       tap(data => console.log('All', JSON.stringify(data))),
    );
  }

}
