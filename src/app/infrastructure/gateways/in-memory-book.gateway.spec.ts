import { describe, it, expect, beforeEach } from "vitest";
import { firstValueFrom } from "rxjs";
import { InMemoryBookGateway } from "./in-memory-book.gateway";
import { Book } from "../../domain/books/models/book-model";

describe("InMemoryBookGateway", () => {
  let gateway: InMemoryBookGateway;

  beforeEach(() => {
    gateway = new InMemoryBookGateway();
    gateway.reset();
  });

  describe("getBooks()", () => {
    it("devrait retourner les livres initiaux", async () => {
      const books = await firstValueFrom(gateway.getBooks());
      expect(books).toHaveLength(3);
      expect(books[0].title).toBe("Clean Code");
    });

    it("devrait retourner une copie du tableau de livres", async () => {
      const books1 = await firstValueFrom(gateway.getBooks());
      const books2 = await firstValueFrom(gateway.getBooks());
      expect(books1).not.toBe(books2);
      expect(books1).toEqual(books2);
    });
  });

  describe("createBook()", () => {
    it("devrait créer un livre avec un ID généré", async () => {
      const newBook: Omit<Book, "id"> = {
        title: "New Book",
        author: "New Author",
        publicationYear: 2024,
      };

      const createdBook = await firstValueFrom(gateway.createBook(newBook));
      expect(createdBook.id).toBeDefined();
      expect(createdBook.title).toBe("New Book");
      expect(createdBook.author).toBe("New Author");
      expect(createdBook.publicationYear).toBe(2024);
    });

    it("devrait ajouter le livre à la liste", async () => {
      const newBook: Omit<Book, "id"> = {
        title: "Test Book",
        author: "Test Author",
        publicationYear: 2025,
      };
      await firstValueFrom(gateway.createBook(newBook));
      const books = await firstValueFrom(gateway.getBooks());

      expect(books).toHaveLength(4);
      expect(books[3].title).toBe("Test Book");
    });

    it("devrait générer des IDs uniques", async () => {
      const book1 = { title: "Book 1", author: null, publicationYear: null };
      const book2 = { title: "Book 2", author: null, publicationYear: null };
      const created1 = await firstValueFrom(gateway.createBook(book1));
      const created2 = await firstValueFrom(gateway.createBook(book2));
      expect(created1.id).not.toBe(created2.id);
    });
  });

  describe("deleteBook()", () => {
    it("devrait supprimer un livre par ID", async () => {
      const bookId = 1;

      await firstValueFrom(gateway.deleteBook(bookId));
      const books = await firstValueFrom(gateway.getBooks());
      expect(books).toHaveLength(2);
      expect(books.find((b) => b.id === bookId)).toBeUndefined();
    });

    it("ne devrait pas échouer lors de la suppression d'un livre inexistant", async () => {
      const nonExistentId = 999;
      await firstValueFrom(gateway.deleteBook(nonExistentId));
      const books = await firstValueFrom(gateway.getBooks());
      expect(books).toHaveLength(3);
    });
  });

  describe("reset()", () => {
    it("devrait réinitialiser à l'état initial", async () => {
      await firstValueFrom(gateway.createBook({ title: "Test", author: null, publicationYear: null }));
      await firstValueFrom(gateway.deleteBook(1));
      gateway.reset();
      const books = await firstValueFrom(gateway.getBooks());
      expect(books).toHaveLength(3);
      expect(books[0].id).toBe(1);
    });
  });
});
