import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { defer, Observable } from 'rxjs';
import { Book } from '../../domain/books/models/book-model';
import { CreateBookGateway } from '../../domain/books/gateways/create-book';
import { DeleteBookGateway } from '../../domain/books/gateways/delete-book';
import { GetBooksGateway } from '../../domain/books/gateways/get-books';

@Injectable({
  providedIn: 'root',
})
export class HttpBookGateway
  implements CreateBookGateway, DeleteBookGateway, GetBooksGateway
{
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/books';

  getBooks(): Observable<Book[]> {
    return defer(() => this.http.get<Book[]>(this.baseUrl));
  }

  createBook(book: Omit<Book, 'id'>): Observable<Book> {
    return defer(() => this.http.post<Book>(this.baseUrl, book));
  }

  deleteBook(id: number): Observable<void> {
    return defer(() => this.http.delete<void>(`${this.baseUrl}/${id}`));
  }
}
