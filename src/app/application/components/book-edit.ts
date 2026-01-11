import { Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../domain/books/models/book-model';

@Component({
  selector: 'app-book-edit',
  imports: [ReactiveFormsModule],
  template: `
    <div class="bg-islands-surface-primary rounded-lg shadow-islands-md p-6 border border-islands-border-primary">
      <h3 class="text-2xl font-bold text-islands-text-inverse mb-6">
        {{ isEditMode() ? 'Éditer le livre' : 'Ajouter un livre' }}
      </h3>

      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        data-testid="book-edit-form"
        class="space-y-4"
      >
        <div>
          <label for="title" class="block text-sm font-medium text-islands-text-secondary mb-2">
            Titre
            <span class="text-islands-error-text">*</span>
          </label>
          <input
            id="title"
            data-testid="title-input"
            formControlName="title"
            type="text"
            placeholder="Entrez le titre du livre"
            class="w-full px-4 py-2 bg-islands-surface-secondary border border-islands-border-primary rounded-lg focus:ring-2 focus:ring-islands-border-focus focus:border-transparent transition-all duration-200 text-islands-text-primary placeholder:text-islands-text-disabled"
            [class.border-islands-error-border]="
              form.get('title')?.invalid && form.get('title')?.touched
            "
          />
          @if (form.get('title')?.invalid && form.get('title')?.touched) {
            <p class="mt-1 text-sm text-islands-error-text">Le titre est obligatoire</p>
          }
        </div>

        <div>
          <label for="author" class="block text-sm font-medium text-islands-text-secondary mb-2">
            Auteur
          </label>
          <input
            id="author"
            data-testid="author-input"
            formControlName="author"
            type="text"
            placeholder="Entrez le nom de l'auteur"
            class="w-full px-4 py-2 bg-islands-surface-secondary border border-islands-border-primary rounded-lg focus:ring-2 focus:ring-islands-border-focus focus:border-transparent transition-all duration-200 text-islands-text-primary placeholder:text-islands-text-disabled"
          />
        </div>

        <div>
          <label
            for="publicationYear"
            class="block text-sm font-medium text-islands-text-secondary mb-2"
          >
            Année de publication
          </label>
          <input
            id="publicationYear"
            data-testid="year-input"
            formControlName="publicationYear"
            type="number"
            placeholder="2024"
            class="w-full px-4 py-2 bg-islands-surface-secondary border border-islands-border-primary rounded-lg focus:ring-2 focus:ring-islands-border-focus focus:border-transparent transition-all duration-200 text-islands-text-primary placeholder:text-islands-text-disabled"
          />
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            data-testid="submit-button"
            [disabled]="form.invalid"
            class="flex-1 px-6 py-3 bg-islands-accent-blue text-white rounded-lg hover:bg-opacity-90 disabled:bg-islands-border-secondary disabled:cursor-not-allowed disabled:text-islands-text-disabled transition-all duration-200 font-medium shadow-islands-sm"
          >
            {{ isEditMode() ? 'Mettre à jour' : 'Ajouter' }}
          </button>
          <button
            type="button"
            data-testid="cancel-button"
            (click)="onCancel()"
            class="flex-1 px-6 py-3 bg-islands-surface-tertiary text-islands-text-primary rounded-lg hover:bg-islands-bg-hover transition-colors duration-200 font-medium border border-islands-border-primary"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  `,
})
export class BookEdit {
  readonly book = input<Book | null>(null);
  readonly bookSaved = output<Partial<Book>>();
  readonly cancelled = output<void>();

  readonly isEditMode = computed(() => this.book() !== null);

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    author: [null],
    publicationYear: [null],
  });

  private readonly _formSync = effect(() => {
    const book = this.book();
    if (book) {
      this.form.patchValue({
        title: book.title,
        author: book.author,
        publicationYear: book.publicationYear,
      });
    } else {
      this.form.reset();
    }
  });

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const bookData: Partial<Book> = {
        title: formValue.title,
        author: formValue.author || null,
        publicationYear: formValue.publicationYear || null,
      };

      if (this.isEditMode()) {
        bookData.id = this.book()!.id;
      }

      this.bookSaved.emit(bookData);
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
