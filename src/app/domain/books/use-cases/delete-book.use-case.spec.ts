import { describe, it, expect, beforeEach } from "vitest";
import { firstValueFrom } from "rxjs";
import { DeleteBookUseCase } from "./delete-book.use-case";
import { InMemoryBookGateway } from "../../../infrastructure/gateways/in-memory-book.gateway";

describe("DeleteBookUseCase", () => {
  let gateway: InMemoryBookGateway;
  let useCase: DeleteBookUseCase;

  beforeEach(() => {
    gateway = new InMemoryBookGateway();
    gateway.reset();
    useCase = new DeleteBookUseCase(gateway);
  });

  it("devrait supprimer un livre par ID", async () => {
    const bookId = 1;
    const booksBefore = await firstValueFrom(gateway.getBooks());
    expect(booksBefore).toHaveLength(3);
    await firstValueFrom(useCase.execute(bookId));
    const booksAfter = await firstValueFrom(gateway.getBooks());
    expect(booksAfter).toHaveLength(2);
    expect(booksAfter.find(b => b.id === bookId)).toBeUndefined();
  });

  it("devrait supprimer le bon livre", async () => {
    const bookIdToDelete = 2;
    await firstValueFrom(useCase.execute(bookIdToDelete));
    const books = await firstValueFrom(gateway.getBooks());
    expect(books).toHaveLength(2);
    expect(books.find(b => b.title === "Refactoring")).toBeUndefined();
    expect(books.find(b => b.title === "Clean Code")).toBeDefined();
    expect(books.find(b => b.title === "Design Patterns")).toBeDefined();
  });

  it("ne devrait pas échouer lors de la suppression d'un livre inexistant", async () => {
    const nonExistentId = 999;
    await firstValueFrom(useCase.execute(nonExistentId));
    const books = await firstValueFrom(gateway.getBooks());
    expect(books).toHaveLength(3); // Aucun livre supprimé
  });
});
