import {Injectable} from '@angular/core';
import {Book} from '../models/book';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, filter, flatMap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class BookService {
  private booksUrl = 'http://henri-potier.xebia.fr/books';

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.booksUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }

  getBook(isbn: string): Observable<Book> {
    return this.getBooks()
      .pipe(
        flatMap((data: Book[]) => data),
        filter((book: Book) => book.isbn === isbn));
  }
}


