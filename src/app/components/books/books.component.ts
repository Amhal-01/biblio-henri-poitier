import {Component, OnInit} from '@angular/core';
import {Book} from '../../models/book';
import {BookService} from '../../services/book.service';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
})

export class BooksComponent implements OnInit {
  constructor(private bookService: BookService, private cartService: CartService) {
  }

  searchBook = '';

  bookInTheCart: Book[] = [];
  books: Book[];
  choices: Book[] = [];
  selectedBook: Book;

  selectedTempStatic(book) {
    this.searchBook = book;
    this.selectedBook = book;
  }

  getBooks(): void {
    this.bookService.getBooks()
      .subscribe(books => this.books = books);
  }

  getBook(isbn: string): Book {
    this.bookService.getBook(isbn)
      .subscribe(book => this.selectedBook = book);
    return this.selectedBook;
  }

  unSelectBook(): void {
    this.selectedBook = null;
  }

  ngOnInit() {
    this.getBooks();
    this.getRandomChoice();
    this.refreshCart();
  }

  getRandomChoice(): void {
    this.bookService.getBooks()
      .subscribe(data => {
        const index: number[] = [];
        while (index.length < 3) {
          const randomNumber = Math.floor(Math.random() * data.length);
          let found = false;
          for (const i of index) {
            if (i === randomNumber) {
              found = true;
            }
          }
          if (!found) {
            index.push(randomNumber);
          }
        }
        this.choices.push(data[index[0]]);
        this.choices.push(data[index[1]]);
        this.choices.push(data[index[2]]);
      });
  }

  addToCart(isbnToAdd: string): void {
    this.cartService.addToCart(isbnToAdd);
    this.refreshCart();
  }

  refreshCart(): void {
    if (this.cartService.getBooksInCart()) {
      this.bookInTheCart = this.cartService.getBooksInCart();
    }
  }
}
