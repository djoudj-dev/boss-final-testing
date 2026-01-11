import { Component, input, output } from '@angular/core';
import { Book } from '../../domain/books/models/book-model';

@Component({
  selector: 'app-books-list',
  template: `
    <div class="bg-islands-surface-primary rounded-lg shadow-islands-md p-6 border border-islands-border-primary">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-islands-text-inverse">Ma bibliothèque</h2>
        <button
          data-testid="add-button"
          (click)="onAddBook()"
          class="px-4 py-2 bg-islands-accent-blue text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center gap-2 shadow-islands-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/>
          </svg>
          Ajouter un livre
        </button>
      </div>

      @if (books().length === 0) {
        <div class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v14m-9-3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4a4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3a3 3 0 0 0-3-3z"/>
          </svg>
          <p class="text-islands-text-secondary text-lg">Aucun livre dans votre bibliothèque</p>
          <p class="text-islands-text-tertiary text-sm mt-2">Commencez par ajouter votre premier livre</p>
        </div>
      } @else {
        <div class="grid gap-4">
          @for (book of books(); track book.id) {
            <div
              [attr.data-testid]="'book-item-' + book.id"
              class="bg-islands-surface-secondary border border-islands-border-primary rounded-lg p-4 hover:border-islands-border-focus hover:shadow-islands transition-all duration-200"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-islands-text-inverse mb-1">
                    {{ book.title }}
                  </h3>
                  <div class="flex flex-wrap gap-3 text-sm text-islands-text-secondary">
                    @if (book.author) {
                      <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </g>
                        </svg>
                        {{ book.author }}
                      </span>
                    }
                    @if (book.publicationYear) {
                      <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M8 2v4m8-4v4"/>
                            <rect width="18" height="18" x="3" y="4" rx="2"/>
                            <path d="M3 10h18"/>
                          </g>
                        </svg>
                        {{ book.publicationYear }}
                      </span>
                    }
                  </div>
                </div>
                <button
                  [attr.data-testid]="'delete-button-' + book.id"
                  (click)="onDeleteBook(book.id)"
                  class="ml-4 p-2 text-islands-accent-red hover:bg-islands-error-bg rounded-lg transition-colors duration-200"
                  title="Supprimer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class BooksList {
  readonly books = input.required<Book[]>();
  readonly addRequested = output<void>();
  readonly deleteRequested = output<number>();

  onAddBook(): void {
    this.addRequested.emit();
  }

  onDeleteBook(id: number): void {
    this.deleteRequested.emit(id);
  }
}
