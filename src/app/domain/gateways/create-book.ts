import { Observable } from 'rxjs';
import { Book } from '../models/book-model';

export interface CreateBookGateway {
  createBook(book: Omit<Book, 'id'>): Observable<Book>;
}
