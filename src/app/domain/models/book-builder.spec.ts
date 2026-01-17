import { describe, it, expect } from 'vitest';
import { BookBuilder } from './book-builder';

describe('BookBuilder', () => {
  it('should build a default book', () => {
    const book = BookBuilder.default().build();

    expect(book).toBeDefined();
    expect(book.id).toBe(1);
    expect(book.title).toBe('Default Book');
  });

  it('should build a Clean Code book', () => {
    const book = BookBuilder.cleanCode().build();

    expect(book.title).toBe('Clean Code');
    expect(book.author).toBe('Robert C. Martin');
    expect(book.publicationYear).toBe(2008);
  });

  it('should build multiple books', () => {
    const books = BookBuilder.default().buildMany(3);

    expect(books).toHaveLength(3);
    expect(books[0].id).toBe(1);
    expect(books[1].id).toBe(2);
    expect(books[2].id).toBe(3);
  });

  it('should allow custom properties with with()', () => {
    const book = BookBuilder.default()
      .with('title', 'Custom Title')
      .with('author', 'Custom Author')
      .build();

    expect(book.title).toBe('Custom Title');
    expect(book.author).toBe('Custom Author');
  });
});
