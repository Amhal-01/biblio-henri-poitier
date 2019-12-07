import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BooksComponent} from './components/books/books.component';
import {CartComponent} from './components/cart/cart.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { NgxTypeaheadModule } from 'ngx-typeahead';

@NgModule({
  declarations: [
    AppComponent,
    BooksComponent,
    CartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxTypeaheadModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
