import { Observable } from "rxjs";
import { DeleteBookGateway } from "../gateways/delete-book";

export class DeleteBookUseCase {
  constructor(private readonly gateway: DeleteBookGateway) {}

  execute(id: number): Observable<void> {
    return this.gateway.deleteBook(id);
  }
}
