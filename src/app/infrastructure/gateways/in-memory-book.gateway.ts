import { Injectable } from "@angular/core";
import { defer, Observable, of } from "rxjs";
import { GetBooksGateway } from "../../domain/books/gateways/get-books";
import { CreateBookGateway } from "../../domain/books/gateways/create-book";
import { DeleteBookGateway } from "../../domain/books/gateways/delete-book";
import { Book } from "../../domain/books/models/book-model";

@Injectable()
export class InMemoryBookGateway implements GetBooksGateway, CreateBookGateway, DeleteBookGateway {
  private books: Book[] = [
    { id: 1, title: "Clean Code", author: "Robert C. Martin", publicationYear: 2008 },
    { id: 2, title: "Refactoring", author: "Martin Fowler", publicationYear: 1999 },
    { id: 3, title: "Design Patterns", author: "Gang of Four", publicationYear: 1994 },
  ];
  private nextId = 4;

  getBooks(): Observable<Book[]> {
    return defer(() => of([...this.books]));
  }

  createBook(book: Omit<Book, "id">): Observable<Book> {
    return defer(() => {
      const newBook: Book = {
        id: this.nextId++,
        ...book,
      };
      this.books.push(newBook);
      return of(newBook);
    });
  }

  deleteBook(id: number): Observable<void> {
    return defer(() => {
      const index = this.books.findIndex((book) => book.id === id);
      if (index !== -1) {
        this.books.splice(index, 1);
      }
      return of(void 0);
    });
  }

  reset(): void {
    this.books = [
      { id: 1, title: "Clean Code", author: "Robert C. Martin", publicationYear: 2008 },
      { id: 2, title: "Refactoring", author: "Martin Fowler", publicationYear: 1999 },
      { id: 3, title: "Design Patterns", author: "Gang of Four", publicationYear: 1994 },
    ];
    this.nextId = 4;
  }
}
