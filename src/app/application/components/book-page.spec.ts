import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BookPage } from './book-page';
import { BookBuilder } from '../../domain/books/models/book-builder';
import { HttpBookGateway } from '../../infrastructure/gateways/http-book';
import { GET_BOOKS_GATEWAY } from '../../domain/books/gateways/get-books.gateway.token';
import { CREATE_BOOK_GATEWAY } from '../../domain/books/gateways/create-book.gateway.token';
import { DELETE_BOOK_GATEWAY } from '../../domain/books/gateways/delete-book.gateway.token';

describe('BookPage - Integration Tests', () => {
  let component: BookPage;
  let fixture: ComponentFixture<BookPage>;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BookPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HttpBookGateway,
        { provide: GET_BOOKS_GATEWAY, useExisting: HttpBookGateway },
        { provide: CREATE_BOOK_GATEWAY, useExisting: HttpBookGateway },
        { provide: DELETE_BOOK_GATEWAY, useExisting: HttpBookGateway },
      ],
    });

    fixture = TestBed.createComponent(BookPage);
    component = fixture.componentInstance;
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('Chargement des livres', () => {
    it('devrait charger les livres au démarrage', async () => {
      const expectedBooks = BookBuilder.default().buildMany(3);

      fixture.detectChanges();
      const req = httpController.expectOne({
        method: 'GET',
        url: 'http://localhost:3000/books',
      });
      req.flush(expectedBooks);
      await fixture.whenStable();

      expect(component.books()).toEqual(expectedBooks);
    });
  });

  describe('Création de livre', () => {
    it('devrait créer un livre et recharger la liste', async () => {
      const initialBooks = BookBuilder.default().buildMany(2);
      const { id, ...newBookData } = BookBuilder.default().with('title', 'New Book').build();
      const createdBook = BookBuilder.default().with('id', 3).with('title', 'New Book').build();
      const updatedBooks = [...initialBooks, createdBook];

      fixture.detectChanges();
      const initReq = httpController.expectOne('http://localhost:3000/books');
      initReq.flush(initialBooks);
      await fixture.whenStable();

      component.onAddRequested();
      expect(component.mode()).toBe('create');

      component.onBookSaved(newBookData);

      const createReq = httpController.expectOne({
        method: 'POST',
        url: 'http://localhost:3000/books',
      });
      expect(createReq.request.body).toEqual(newBookData);
      createReq.flush(createdBook);

      const reloadReq = httpController.expectOne({
        method: 'GET',
        url: 'http://localhost:3000/books',
      });
      reloadReq.flush(updatedBooks);
      await fixture.whenStable();

      expect(component.books()).toEqual(updatedBooks);
      expect(component.mode()).toBe('list');
    });
  });

  describe('Suppression de livre', () => {
    it('devrait supprimer un livre et recharger la liste', async () => {
      const initialBooks = BookBuilder.default().buildMany(3);
      const bookToDelete = initialBooks[1];
      const updatedBooks = initialBooks.filter(b => b.id !== bookToDelete.id);

      vi.spyOn(window, 'confirm').mockReturnValue(true);

      fixture.detectChanges();
      const initReq = httpController.expectOne('http://localhost:3000/books');
      initReq.flush(initialBooks);
      await fixture.whenStable();

      component.onDeleteRequested(bookToDelete.id);

      const deleteReq = httpController.expectOne({
        method: 'DELETE',
        url: `http://localhost:3000/books/${bookToDelete.id}`,
      });
      deleteReq.flush(null);

      const reloadReq = httpController.expectOne({
        method: 'GET',
        url: 'http://localhost:3000/books',
      });
      reloadReq.flush(updatedBooks);
      await fixture.whenStable();

      expect(component.books()).toEqual(updatedBooks);
    });

    it('ne devrait pas supprimer si l\'utilisateur annule', async () => {
      const initialBooks = BookBuilder.default().buildMany(3);

      vi.spyOn(window, 'confirm').mockReturnValue(false);

      fixture.detectChanges();
      const initReq = httpController.expectOne('http://localhost:3000/books');
      initReq.flush(initialBooks);
      await fixture.whenStable();

      component.onDeleteRequested(initialBooks[0].id);

      httpController.expectNone({
        method: 'DELETE',
        url: `http://localhost:3000/books/${initialBooks[0].id}`,
      });

      expect(component.books()).toEqual(initialBooks);
    });
  });
});
