import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BooksList } from './books-list';
import { BookBuilder } from '../../domain/books/models/book-builder';

describe('BooksList', () => {
  let component: BooksList;
  let fixture: ComponentFixture<BooksList>;

  const setup = (books = BookBuilder.default().buildMany(2)) => {
    fixture = TestBed.createComponent(BooksList);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('books', books);
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BooksList],
    });
  });

  describe('Affichage des livres', () => {
    it('devrait afficher un état vide quand il n\'y a pas de livres', () => {
      setup([]);

      const emptyMessage = fixture.debugElement.query(By.css('.text-islands-text-secondary'));
      expect(emptyMessage).not.toBeNull();
      expect(emptyMessage?.nativeElement.textContent).toContain('Aucun livre');
    });

    it('devrait afficher la liste des livres', () => {
      const books = BookBuilder.default().buildMany(2);
      setup(books);

      const bookItems = fixture.debugElement.queryAll(By.css('[data-testid^="book-item-"]'));
      expect(bookItems).toHaveLength(2);
    });
  });

  describe('Bouton ajouter', () => {
    it('devrait émettre addRequested au clic', () => {
      setup([]);
      const emitSpy = vi.fn();
      component.addRequested.subscribe(emitSpy);

      const addButton = fixture.debugElement.query(By.css('[data-testid="add-button"]'));
      expect(addButton).not.toBeNull();

      addButton.nativeElement.click();
      fixture.detectChanges();

      expect(emitSpy).toHaveBeenCalledOnce();
    });
  });

  describe('Bouton supprimer', () => {
    it('devrait émettre deleteRequested avec l\'id du livre au clic', () => {
      const books = BookBuilder.default().with('id', 42).buildMany(1);
      setup(books);
      const emitSpy = vi.fn();
      component.deleteRequested.subscribe(emitSpy);

      const deleteButton = fixture.debugElement.query(By.css('[data-testid="delete-button-42"]'));
      expect(deleteButton).not.toBeNull();

      deleteButton.nativeElement.click();
      fixture.detectChanges();

      expect(emitSpy).toHaveBeenCalledOnce();
      expect(emitSpy).toHaveBeenCalledWith(42);
    });
  });
});
