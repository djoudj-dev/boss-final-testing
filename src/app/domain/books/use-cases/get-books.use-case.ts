import { Observable } from "rxjs";
import { GetBooksGateway } from "../gateways/get-books";
import { Book } from "../models/book-model";

export class GetBooksUseCase {
  constructor(private readonly gateway: GetBooksGateway) {}

  execute(): Observable<Book[]> {
    return this.gateway.getBooks();
  }
}
