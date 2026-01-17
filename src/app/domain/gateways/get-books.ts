import { Observable } from 'rxjs';
import { Book } from '../models/book-model';

export interface GetBooksGateway {
  getBooks(): Observable<Book[]>;
}
