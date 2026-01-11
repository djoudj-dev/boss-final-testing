import { ApplicationConfig, provideZonelessChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpBookGateway } from './infrastructure/gateways/http-book';
import { GET_BOOKS_GATEWAY } from './domain/books/gateways/get-books.gateway.token';
import { CREATE_BOOK_GATEWAY } from './domain/books/gateways/create-book.gateway.token';
import { DELETE_BOOK_GATEWAY } from './domain/books/gateways/delete-book.gateway.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    HttpBookGateway,
    { provide: GET_BOOKS_GATEWAY, useExisting: HttpBookGateway },
    { provide: CREATE_BOOK_GATEWAY, useExisting: HttpBookGateway },
    { provide: DELETE_BOOK_GATEWAY, useExisting: HttpBookGateway },
  ]
};
