import { Book } from './book-model';

export class BookBuilder {
  private entity: Book = {
    id: 1,
    title: 'Default Book',
    author: null,
    publicationYear: null,
  };

  static default(): BookBuilder {
    return new BookBuilder();
  }

  static cleanCode(): BookBuilder {
    return new BookBuilder()
      .with('title', 'Clean Code')
      .with('author', 'Robert C. Martin')
      .with('publicationYear', 2008);
  }

  static refactoring(): BookBuilder {
    return new BookBuilder()
      .with('title', 'Refactoring')
      .with('author', 'Martin Fowler')
      .with('publicationYear', 1999);
  }

  with<K extends keyof Book>(key: K, value: Book[K]): BookBuilder {
    this.entity = { ...this.entity, [key]: value };
    return this;
  }

  build(): Book {
    return { ...this.entity };
  }

  buildMany(count: number): Book[] {
    return Array.from({ length: count }, (_, i) =>
      new BookBuilder()
        .with('id', this.entity.id + i)
        .with('title', `${this.entity.title} ${i + 1}`)
        .with('author', this.entity.author)
        .with('publicationYear', this.entity.publicationYear)
        .build()
    );
  }
}
