import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { InMemoryBookGateway } from './infrastructure/gateways/in-memory-book.gateway';
import { GET_BOOKS_GATEWAY } from './domain/books/gateways/get-books.gateway.token';
import { CREATE_BOOK_GATEWAY } from './domain/books/gateways/create-book.gateway.token';
import { DELETE_BOOK_GATEWAY } from './domain/books/gateways/delete-book.gateway.token';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        InMemoryBookGateway,
        { provide: GET_BOOKS_GATEWAY, useExisting: InMemoryBookGateway },
        { provide: CREATE_BOOK_GATEWAY, useExisting: InMemoryBookGateway },
        { provide: DELETE_BOOK_GATEWAY, useExisting: InMemoryBookGateway },
      ],
    }).compileComponents();
  });

  it('devrait créer l\'application', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('devrait afficher le titre', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Gestion de Bibliothèque');
  });
});
