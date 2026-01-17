import { describe, it, expect, beforeEach } from "vitest";
import { firstValueFrom } from "rxjs";
import { GetBooksUseCase } from "./get-books.use-case";
import { InMemoryBookGateway } from "../../../infrastructure/gateways/in-memory-book.gateway";

describe("GetBooksUseCase", () => {
  let gateway: InMemoryBookGateway;
  let useCase: GetBooksUseCase;

  beforeEach(() => {
    gateway = new InMemoryBookGateway();
    gateway.reset();
    useCase = new GetBooksUseCase(gateway);
  });

  it("devrait récupérer tous les livres depuis le gateway", async () => {
    const result = await firstValueFrom(useCase.execute());
    expect(result).toHaveLength(3);
    expect(result[0].title).toBe("Clean Code");
    expect(result[1].title).toBe("Refactoring");
    expect(result[2].title).toBe("Design Patterns");
  });

  it("devrait retourner la liste mise à jour après l'ajout d'un livre", async () => {
    await firstValueFrom(gateway.createBook({
      title: "New Book",
      author: "New Author",
      publicationYear: 2024,
    }));

    const result = await firstValueFrom(useCase.execute());
    expect(result).toHaveLength(4);
    expect(result[3].title).toBe("New Book");
  });

  it("devrait retourner la liste mise à jour après la suppression d'un livre", async () => {
    await firstValueFrom(gateway.deleteBook(1));
    const result = await firstValueFrom(useCase.execute());
    expect(result).toHaveLength(2);
    expect(result.find(b => b.id === 1)).toBeUndefined();
  });
});
