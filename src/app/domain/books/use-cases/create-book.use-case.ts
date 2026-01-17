import { Observable } from "rxjs";
import { CreateBookGateway } from "../gateways/create-book";
import { Book } from "../models/book-model";

export class CreateBookUseCase {
  constructor(private readonly gateway: CreateBookGateway) {}

  execute(book: Omit<Book, "id">): Observable<Book> {
    return this.gateway.createBook(book);
  }
}
