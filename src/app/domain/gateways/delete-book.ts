import { Observable } from 'rxjs';

export interface DeleteBookGateway {
  deleteBook(id: number): Observable<void>;
}
