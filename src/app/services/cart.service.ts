import {Injectable} from '@angular/core';
import {Book} from '../models/book';
import {BookService} from './book.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class CartService {
  private booksUrl = 'http://henri-potier.xebia.fr/books/';

  constructor(private bookService: BookService,
              private http: HttpClient) {
  }

  addToCart(isbnToAdd: string): void {
    let found = false;
    const isbns = localStorage.getItem('bookInCart') ? localStorage.getItem('bookInCart').split(',') : [];
    for (const isbn of isbns) {
      if (isbn === isbnToAdd) {
        found = true;
      }
    }
    if (found === false) {
      isbns.push(isbnToAdd);
    }
    localStorage.setItem('bookInCart', isbns.join(','));
  }

  getBooksInCart(): Book[] {
    const books: Book[] = [];
    if (localStorage.getItem('bookInCart')) {
      const isbns = localStorage.getItem('bookInCart').split(',');
      for (const isbn of isbns) {
        this.bookService.getBooks()
          .subscribe(data => {
            for (const book of data) {
              if (book.isbn === isbn) {
                books.push(book);
              }
            }
          });
      }
      return books;
    }
  }

  getCommercialOffer(): Observable<any> {
    const isbns = localStorage.getItem('bookInCart');
    if (isbns) {
      const commercialURL = this.booksUrl + isbns + '/commercialOffers';
      return this.http.get(commercialURL)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            return throwError(error);
          })
        );
    }
    return null;
  }
}

