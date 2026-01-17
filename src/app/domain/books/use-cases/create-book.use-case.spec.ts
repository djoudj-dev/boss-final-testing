import { describe, it, expect, beforeEach } from "vitest";
import { firstValueFrom } from "rxjs";
import { CreateBookUseCase } from "./create-book.use-case";
import { InMemoryBookGateway } from "../../../infrastructure/gateways/in-memory-book.gateway";
import { Book } from "../models/book-model";

describe("CreateBookUseCase", () => {
  let gateway: InMemoryBookGateway;
  let useCase: CreateBookUseCase;

  beforeEach(() => {
    gateway = new InMemoryBookGateway();
    gateway.reset();
    useCase = new CreateBookUseCase(gateway);
  });

  it("devrait créer un livre et le retourner avec un ID", async () => {
    const newBook: Omit<Book, "id"> = {
      title: "New Book",
      author: "Test Author",
      publicationYear: 2024,
    };

    const result = await firstValueFrom(useCase.execute(newBook));
    expect(result.id).toBeDefined();
    expect(result.title).toBe("New Book");
    expect(result.author).toBe("Test Author");
    expect(result.publicationYear).toBe(2024);
  });

  it("devrait ajouter le livre créé à la liste", async () => {
    const newBook: Omit<Book, "id"> = {
      title: "Clean Architecture",
      author: "Robert C. Martin",
      publicationYear: 2017,
    };

    await firstValueFrom(useCase.execute(newBook));
    const books = await firstValueFrom(gateway.getBooks());
    expect(books).toHaveLength(4); // 3 initiaux + 1 nouveau
    expect(books[3].title).toBe("Clean Architecture");
  });

  it("devrait générer des IDs uniques pour plusieurs livres", async () => {
    const book1: Omit<Book, "id"> = { title: "Book 1", author: "Author 1", publicationYear: 2020 };
    const book2: Omit<Book, "id"> = { title: "Book 2", author: "Author 2", publicationYear: 2021 };
    const created1 = await firstValueFrom(useCase.execute(book1));
    const created2 = await firstValueFrom(useCase.execute(book2));
    expect(created1.id).not.toBe(created2.id);
    expect(created1.id).toBeDefined();
    expect(created2.id).toBeDefined();
  });
});
