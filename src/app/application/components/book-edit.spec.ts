import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BookEdit } from './book-edit';
import { BookBuilder } from '../../domain/books/models/book-builder';

describe('BookEdit', () => {
  let component: BookEdit;
  let fixture: ComponentFixture<BookEdit>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BookEdit],
    });

    fixture = TestBed.createComponent(BookEdit);
    component = fixture.componentInstance;
  });

  describe('Mode création', () => {
    it('devrait être en mode création quand book est null', () => {
      fixture.componentRef.setInput('book', null);
      fixture.detectChanges();

      expect(component.isEditMode()).toBe(false);
      expect(component.form.value.title).toBeNull();
    });

    it('devrait afficher le titre "Ajouter un livre" en mode création', () => {
      fixture.componentRef.setInput('book', null);
      fixture.detectChanges();

      const title = fixture.debugElement.query(By.css('h3'));
      expect(title.nativeElement.textContent).toContain('Ajouter un livre');
    });

    it('devrait afficher le texte "Ajouter" sur le bouton en mode création', () => {
      fixture.componentRef.setInput('book', null);
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(By.css('[data-testid="submit-button"]'));
      expect(submitButton.nativeElement.textContent).toContain('Ajouter');
    });
  });

  describe('Mode édition', () => {
    it('devrait être en mode édition quand un livre est fourni', () => {
      const book = BookBuilder.default().build();
      fixture.componentRef.setInput('book', book);
      fixture.detectChanges();

      expect(component.isEditMode()).toBe(true);
    });

    it('devrait pré-remplir le formulaire avec les données du livre', () => {
      const book = BookBuilder.default().with('title', 'Test Book').with('author', 'Test Author').with('publicationYear', 2024).build();
      fixture.componentRef.setInput('book', book);
      fixture.detectChanges();

      expect(component.form.value.title).toBe('Test Book');
      expect(component.form.value.author).toBe('Test Author');
      expect(component.form.value.publicationYear).toBe(2024);
    });

    it('devrait afficher le titre "Éditer le livre" en mode édition', () => {
      const book = BookBuilder.default().build();
      fixture.componentRef.setInput('book', book);
      fixture.detectChanges();

      const title = fixture.debugElement.query(By.css('h3'));
      expect(title.nativeElement.textContent).toContain('Éditer le livre');
    });

    it('devrait afficher le texte "Mettre à jour" sur le bouton en mode édition', () => {
      const book = BookBuilder.default().build();
      fixture.componentRef.setInput('book', book);
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(By.css('[data-testid="submit-button"]'));
      expect(submitButton.nativeElement.textContent).toContain('Mettre à jour');
    });
  });

  describe('Soumission du formulaire', () => {
    it('devrait émettre bookSaved avec les données en mode création', () => {
      fixture.componentRef.setInput('book', null);
      fixture.detectChanges();

      const emitSpy = vi.fn();
      component.bookSaved.subscribe(emitSpy);

      component.form.patchValue({
        title: 'New Book',
        author: 'New Author',
        publicationYear: 2025,
      });
      component.onSubmit();

      expect(emitSpy).toHaveBeenCalledOnce();
      expect(emitSpy).toHaveBeenCalledWith({
        title: 'New Book',
        author: 'New Author',
        publicationYear: 2025,
      });
    });

    it('devrait émettre bookSaved avec l\'id du livre en mode édition', () => {
      const book = BookBuilder.default().with('id', 42).build();
      fixture.componentRef.setInput('book', book);
      fixture.detectChanges();

      const emitSpy = vi.fn();
      component.bookSaved.subscribe(emitSpy);

      component.form.patchValue({
        title: 'Updated Book',
      });
      component.onSubmit();

      expect(emitSpy).toHaveBeenCalledOnce();
      expect(emitSpy.mock.calls[0][0]).toMatchObject({
        id: 42,
        title: 'Updated Book',
      });
    });

    it('ne devrait pas émettre bookSaved quand le formulaire est invalide', () => {
      fixture.componentRef.setInput('book', null);
      fixture.detectChanges();

      const emitSpy = vi.fn();
      component.bookSaved.subscribe(emitSpy);

      component.form.patchValue({ title: '' });
      component.onSubmit();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('devrait désactiver le bouton de soumission quand le formulaire est invalide', () => {
      fixture.componentRef.setInput('book', null);
      fixture.detectChanges();

      component.form.patchValue({ title: '' });
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(By.css('[data-testid="submit-button"]'));
      expect(submitButton.nativeElement.disabled).toBe(true);
    });
  });

  describe('Annulation', () => {
    it('devrait émettre cancelled quand le bouton annuler est cliqué', () => {
      fixture.componentRef.setInput('book', null);
      fixture.detectChanges();

      const emitSpy = vi.fn();
      component.cancelled.subscribe(emitSpy);

      const cancelButton = fixture.debugElement.query(By.css('[data-testid="cancel-button"]'));
      cancelButton.nativeElement.click();

      expect(emitSpy).toHaveBeenCalledOnce();
    });
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
