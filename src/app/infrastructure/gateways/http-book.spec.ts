import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { HttpBookGateway } from './http-book';
import { BookBuilder } from '../../domain/books/models/book-builder';

describe('HttpBookGateway', () => {
  let gateway: HttpBookGateway;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpBookGateway, provideHttpClient(), provideHttpClientTesting()],
    });

    gateway = TestBed.inject(HttpBookGateway);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('GET /books', () => {
    it('devrait récupérer la liste des livres', async () => {
      const expectedBooks = BookBuilder.default().buildMany(3);
      const resultPromise = firstValueFrom(gateway.getBooks());

      const req = httpController.expectOne({
        method: 'GET',
        url: 'http://localhost:3000/books',
      });
      req.flush(expectedBooks);

      const result = await resultPromise;
      expect(result).toEqual(expectedBooks);
    });
  });

  describe('POST /books', () => {
    it('devrait créer un livre et le retourner', async () => {
      const { id, ...newBook } = BookBuilder.default().build();
      const createdBook = BookBuilder.default().with('id', 1).with('title', newBook.title).build();

      const resultPromise = firstValueFrom(gateway.createBook(newBook));

      const req = httpController.expectOne({
        method: 'POST',
        url: 'http://localhost:3000/books',
      });
      expect(req.request.body).toEqual(newBook);
      req.flush(createdBook);

      const result = await resultPromise;
      expect(result).toEqual(createdBook);
    });
  });

  describe('DELETE /books/:id', () => {
    it('devrait supprimer un livre', async () => {
      const bookId = 42;
      const resultPromise = firstValueFrom(gateway.deleteBook(bookId));

      const req = httpController.expectOne({
        method: 'DELETE',
        url: `http://localhost:3000/books/${bookId}`,
      });
      req.flush(null);

      const result = await resultPromise;
      expect(result).toBeNull();
    });
  });
});
