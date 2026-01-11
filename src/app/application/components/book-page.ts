import { Component, inject, OnInit, signal } from '@angular/core';
import { Book } from '../../domain/books/models/book-model';
import { BooksList } from './books-list';
import { BookEdit } from './book-edit';
import { GET_BOOKS_GATEWAY } from '../../domain/books/gateways/get-books.gateway.token';
import { CREATE_BOOK_GATEWAY } from '../../domain/books/gateways/create-book.gateway.token';
import { DELETE_BOOK_GATEWAY } from '../../domain/books/gateways/delete-book.gateway.token';
import { GetBooksUseCase } from '../../domain/books/use-cases/get-books.use-case';
import { CreateBookUseCase } from '../../domain/books/use-cases/create-book.use-case';
import { DeleteBookUseCase } from '../../domain/books/use-cases/delete-book.use-case';

type ViewMode = 'list' | 'create' | 'edit';

@Component({
  selector: 'app-book-page',
  imports: [BooksList, BookEdit],
  host: { class: 'min-h-screen py-8 px-4' },
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-islands-text-inverse mb-2">Gestion de Bibliothèque</h1>
        <p class="text-islands-text-secondary">Gérez votre collection de livres en toute simplicité</p>
      </div>

      @if (mode() === 'list') {
        <app-books-list
          [books]="books()"
          (addRequested)="onAddRequested()"
          (deleteRequested)="onDeleteRequested($event)"
        />
      } @else {
        <div class="max-w-2xl mx-auto">
          <app-book-edit
            [book]="mode() === 'edit' ? selectedBook() : null"
            (bookSaved)="onBookSaved($event)"
            (cancelled)="onCancelled()"
          />
        </div>
      }
    </div>
  `,
})
export class BookPage implements OnInit {
  private readonly getBooksGateway = inject(GET_BOOKS_GATEWAY);
  private readonly createBookGateway = inject(CREATE_BOOK_GATEWAY);
  private readonly deleteBookGateway = inject(DELETE_BOOK_GATEWAY);

  readonly books = signal<Book[]>([]);
  readonly mode = signal<ViewMode>('list');
  readonly selectedBook = signal<Book | null>(null);

  ngOnInit(): void {
    this.loadBooks();
  }

  private loadBooks(): void {
    new GetBooksUseCase(this.getBooksGateway).execute().subscribe({
      next: (books) => this.books.set(books),
      error: (error) => console.error('Erreur du chargement du livre:', error),
    });
  }

  onAddRequested(): void {
    this.mode.set('create');
    this.selectedBook.set(null);
  }

  onDeleteRequested(id: number): void {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?');
    if (confirmed) {
      new DeleteBookUseCase(this.deleteBookGateway).execute(id).subscribe({
        next: () => {
          this.loadBooks();
        },
        error: (error) => console.error('Erreur de suppression du livre:', error),
      });
    }
  }

  onBookSaved(bookData: Partial<Book>): void {
    if (this.mode() === 'create') {
      new CreateBookUseCase(this.createBookGateway).execute(bookData as Omit<Book, 'id'>).subscribe({
        next: () => {
          this.loadBooks();
          this.mode.set('list');
        },
        error: (error) => console.error('Error creating book:', error),
      });
    }
  }

  onCancelled(): void {
    this.mode.set('list');
    this.selectedBook.set(null);
  }
}
