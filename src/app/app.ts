import { Component } from '@angular/core';
import { BookPage } from './application/components/book-page';

@Component({
  selector: 'app-root',
  imports: [BookPage],
  template: `
    <app-book-page />
  `,
})
export class App {}
