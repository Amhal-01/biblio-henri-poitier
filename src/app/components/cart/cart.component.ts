import {Component, OnInit} from '@angular/core';
import {CartService} from '../../services/cart.service';
import {Book} from '../../models/book';
import {BookService} from '../../services/book.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  private books: Book[] = [];
  private subtotal = 0;
  private discount = 0;
  private total = 0;

  constructor(private cartService: CartService, private bookService: BookService, private router: Router) {
  }

  ngOnInit() {
    if (! localStorage.getItem('bookInCart')) {
      this.router.navigate(['/']);
    }
    this.getCart();
    this.getCommercialOffers();
  }

  getCart(): void {
    this.books = this.cartService.getBooksInCart();
  }

  getCommercialOffers(): void {
    this.cartService.getCommercialOffer()
      .subscribe((offers) => {
          this.bookService.getBooks().subscribe((books) => {
            if (localStorage.getItem('bookInCart')) {
              const isbns = localStorage.getItem('bookInCart').split(',');
              for (const isbn of isbns) {
                for (const book of books) {
                  if (isbn === book.isbn) {
                    this.subtotal += book.price;
                  }
                }
              }
            }
            let sliceOffer = 0;
            let minusOffer = 0;
            let percentageOffer = 0;
            for (const offer of offers.offers) {
              if (offer.type === 'slice' && this.subtotal > offer.sliceValue) {
                sliceOffer = Math.floor(this.subtotal / offer.sliceValue) * offer.value;
              } else if (offer.type === 'percentage') {
                percentageOffer = this.subtotal * offer.value / 100;
              } else if (offer.type === 'minus') {
                minusOffer = offer.value;
              }
            }
            this.discount = Math.max(sliceOffer, minusOffer, percentageOffer);
            this.total = this.subtotal - this.discount;
          });
        }
      );
  }

  checkout(): void {
    localStorage.removeItem('bookInCart');
    this.router.navigate(['/']);
  }

  removeBook(isbn: string): void {
    const isbns = localStorage.getItem('bookInCart').split(',');
    const cleanCart = [];
    for (const id of isbns) {
      if (id !== isbn) {
        cleanCart.push(id);
      }
    }
    localStorage.setItem('bookInCart', cleanCart.join(','));
    this.subtotal = 0;
    this.ngOnInit();
  }
}
