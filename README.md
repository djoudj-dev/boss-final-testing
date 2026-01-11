# 📚 Gestion de Bibliothèque - Projet Boss Final

> Application de gestion de bibliothèque développée en **Test-Driven Development (TDD)** avec Angular, suivant les principes de l'**architecture hexagonale**.

Ce projet est le résultat du module **"Maîtriser les tests avec Vitest"** de la formation EAK (Easy Angular Kit), démontrant la maîtrise complète des tests en Angular.

---

## 🎯 Objectifs pédagogiques

Ce projet illustre les compétences suivantes :

- ✅ **TDD (Test-Driven Development)** : développement piloté par les tests
- ✅ **Architecture hexagonale** : séparation claire des responsabilités
- ✅ **Tests unitaires** : use-cases, modèles, gateways
- ✅ **Tests de composants** : interactions utilisateur, formulaires
- ✅ **Tests d'intégration** : flux complets de bout en bout
- ✅ **Tests HTTP** : mock des appels réseau avec `HttpTestingController`
- ✅ **Patterns de test** : Builder, PageModel, setupTestBed
- ✅ **Clean Code** : code testable, maintenable et lisible

---

## 🏗️ Architecture

### Architecture hexagonale (Clean Architecture)

Le projet suit le pattern **hexagonal** pour garantir l'indépendance du domaine métier :

```
src/app/
├── domain/                      # 🧠 Cœur métier (Pure TypeScript)
│   └── books/
│       ├── models/              # Entités métier
│       │   ├── book-model.ts
│       │   └── book-builder.ts  # Pattern Builder pour les tests
│       ├── gateways/            # Contrats d'interface
│       │   ├── get-books.gateway.token.ts
│       │   ├── create-book.gateway.token.ts
│       │   └── delete-book.gateway.token.ts
│       └── use-cases/           # Logique métier pure
│           ├── get-books.use-case.ts
│           ├── create-book.use-case.ts
│           └── delete-book.use-case.ts
│
├── infrastructure/              # 🔌 Implémentations techniques
│   └── gateways/
│       ├── in-memory-book.gateway.ts  # Mock pour les tests
│       └── http-book.ts               # Vrai appel HTTP
│
└── application/                 # 🎨 Interface utilisateur
    ├── book-list.component.ts
    └── book-edit.component.ts
```

### Principes architecturaux

#### 1. **Séparation des préoccupations**

- **Domain** : logique métier pure, aucune dépendance Angular
- **Infrastructure** : implémentations concrètes (HTTP, LocalStorage, etc.)
- **Application** : composants Angular, UI, interactions utilisateur

#### 2. **Injection de dépendances via tokens**

```typescript
// Définition du contrat (domain)
export interface CreateBookGateway {
  createBook(book: Omit<Book, 'id'>): Observable<Book>;
}

// Token d'injection
export const CREATE_BOOK_GATEWAY = new InjectionToken<CreateBookGateway>('CREATE_BOOK_GATEWAY');

// Configuration (app.config.ts)
providers: [
  HttpBookGateway,
  { provide: CREATE_BOOK_GATEWAY, useExisting: HttpBookGateway }
]
```

#### 3. **Testabilité maximale**

- Use-cases testés sans dépendances Angular
- Gateways mockées pour tests unitaires
- Tests d'intégration avec `InMemoryBookGateway`

---

## 🧪 Stratégie de test

### Types de tests implémentés

#### 1. **Tests unitaires** (Pure TypeScript)

Testent la logique métier isolée, toutes dépendances mockées.

```typescript
// ✅ Exemple : get-books.use-case.spec.ts
describe('GetBooksUseCase', () => {
  it('devrait récupérer tous les livres depuis le gateway', (done) => {
    // Given
    const expectedBooks: Book[] = BookBuilder.default().buildMany(3);
    const gatewayStub: GetBooksGateway = {
      getBooks: vi.fn().mockReturnValue(defer(() => of(expectedBooks)))
    };
    const useCase = new GetBooksUseCase(gatewayStub);

    // When
    useCase.execute().subscribe({
      next: (books) => {
        // Then
        expect(books).toBe(expectedBooks); // Même référence
        expect(books).toEqual(expectedBooks); // Même contenu
        done();
      }
    });
  });
});
```

**Concepts clés :**
- `defer()` pour lazy evaluation des Observables
- `it.each()` pour tester plusieurs jeux de données
- Stubs au lieu de mocks (pas de vérification de comportement)

#### 2. **Tests de composants** (TestBed + PageModel)

Testent l'interaction utilisateur avec le DOM.

```typescript
// ✅ Exemple avec PageModel
describe('BookEditComponent', () => {
  let pageModel: BookEditPageModel;

  beforeEach(() => {
    fixture = TestBed.createComponent(BookEditComponent);
    pageModel = new BookEditPageModel(fixture);
    fixture.detectChanges();
  });

  it('devrait soumettre le formulaire avec les données saisies', () => {
    // Given
    const book = BookBuilder.default().build();
    const emitSpy = vi.spyOn(component.save, 'emit');

    // When
    pageModel.fillForm(book);
    pageModel.submit();

    // Then
    expect(emitSpy).toHaveBeenCalledWith(book);
  });
});
```

**Pattern PageModel** :
- Encapsule l'accès au DOM
- Fournit une interface métier
- Tests lisibles comme une histoire

#### 3. **Tests HTTP** (HttpTestingController)

Vérifient les appels réseau sans vraie requête.

```typescript
describe('HttpBookGateway', () => {
  it('devrait appeler POST /books avec le bon body', async () => {
    // Given
    const newBook = { title: 'Clean Code', author: 'Robert Martin' };

    // When
    const resultPromise = firstValueFrom(gateway.createBook(newBook));

    // Then
    const req = httpController.expectOne({
      method: 'POST',
      url: 'http://localhost:3000/books'
    });
    expect(req.request.body).toEqual(newBook);
    req.flush({ id: 1, ...newBook });

    const result = await resultPromise;
    expect(result.id).toBeDefined();
  });
});
```

#### 4. **Tests d'intégration** (Flux complet)

Testent le parcours utilisateur de bout en bout.

```typescript
describe('BookPage - Intégration', () => {
  it('devrait créer un livre via le formulaire', async () => {
    // Given
    const { pageModel, httpController } = await setupTestBed();

    // When - Clic sur "Ajouter"
    pageModel.clickAddButton();

    // When - Remplir le formulaire
    pageModel.fillTitle('New Book');
    pageModel.fillAuthor('Author');
    pageModel.submit();

    // Then - Vérifier l'appel HTTP
    const req = httpController.expectOne({ method: 'POST' });
    req.flush({ id: 1, title: 'New Book', author: 'Author' });

    await fixture.whenStable();

    // Then - Formulaire fermé
    expect(pageModel.isEditFormDisplayed()).toBe(false);
  });
});
```

---

## 🛠️ Technologies utilisées

### Stack technique

| Technologie | Version | Usage |
|------------|---------|-------|
| **Angular** | 19+ | Framework frontend |
| **TypeScript** | 5.7+ | Langage typé |
| **Vitest** | Latest | Framework de test |
| **RxJS** | 7+ | Programmation réactive |
| **TailwindCSS** | 3+ | Styling (optionnel) |

### Fonctionnalités Angular modernes

- **Standalone Components** : plus de modules NgModule
- **Signals** : gestion d'état réactive
- **Zoneless mode** : détection de changements sans Zone.js via `provideZonelessChangeDetection()`
- **`rxResource`** : chargement déclaratif de données
- **Injection via tokens** : découplage maximum

---

## 📦 Installation

### Prérequis

- Node.js >= 18
- npm >= 9

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-repo/boss-final-testing.git
cd boss-final-testing

# 2. Installer les dépendances
npm install

# 3. Lancer le backend JSON Server (dans un autre terminal)
npm run server

# 4. Lancer l'application Angular
npm run dev

# 5. Lancer les tests
npm run test

# 6. Lancer les tests en mode watch
npm run test:watch

# 7. Générer le coverage
npm run test:coverage
```

---

## 🚀 Utilisation

### Backend JSON Server

Le projet utilise **json-server** pour simuler une API REST.

```bash
# Démarrer le serveur sur http://localhost:3000
npm run server
```

**Endpoints disponibles :**
- `GET /books` : Récupérer tous les livres
- `POST /books` : Créer un livre
- `PUT /books/:id` : Modifier un livre
- `DELETE /books/:id` : Supprimer un livre

### Application Angular

```bash
# Lancer en mode développement
npm run dev

# Ouvrir dans le navigateur
http://localhost:4200
```

**Fonctionnalités :**
- ✅ Afficher la liste des livres
- ✅ Créer un nouveau livre
- ✅ Modifier un livre existant
- ✅ Supprimer un livre

---

## 🧩 Patterns de test

### 1. **Pattern Builder**

Centralise la création de jeux de données pour les tests.

```typescript
export class BookBuilder {
  private entity: Book = {
    id: 1,
    title: 'Default Book',
    author: 'Default Author',
    publicationYear: 2000
  };

  static default(): BookBuilder {
    return new BookBuilder();
  }

  static cleanCode(): BookBuilder {
    return new BookBuilder()
      .with('title', 'Clean Code')
      .with('author', 'Robert C. Martin')
      .with('publicationYear', 2008);
  }

  with<K extends keyof Book>(key: K, value: Book[K]): BookBuilder {
    this.entity[key] = value;
    return this;
  }

  build(): Book {
    return { ...this.entity };
  }

  buildMany(count: number): Book[] {
    return Array.from({ length: count }, (_, i) => ({
      ...this.entity,
      id: this.entity.id + i
    }));
  }
}
```

**Utilisation :**
```typescript
// Livre par défaut
const book = BookBuilder.default().build();

// Livre "Clean Code"
const cleanCode = BookBuilder.cleanCode().build();

// Personnalisation
const customBook = BookBuilder.default()
  .with('title', 'My Custom Book')
  .with('author', 'John Doe')
  .build();

// Plusieurs livres
const books = BookBuilder.default().buildMany(5);
```

### 2. **Pattern PageModel**

Encapsule l'accès au DOM et fournit une interface métier.

```typescript
export class BookEditPageModel {
  constructor(private readonly fixture: ComponentFixture<BookEditComponent>) {}

  // Getters privés (détails d'implémentation cachés)
  private get titleInput(): DebugElement {
    return this.fixture.debugElement.query(By.css('#title'));
  }

  // Méthodes métier publiques
  fillTitle(title: string): void {
    this.titleInput.nativeElement.value = title;
    this.titleInput.triggerEventHandler('input', {
      target: this.titleInput.nativeElement
    });
    this.fixture.detectChanges();
  }

  submit(): void {
    const submitButton = this.fixture.debugElement.query(By.css('.submit-button'));
    submitButton.nativeElement.click();
    this.fixture.detectChanges();
  }

  // Assertions
  getTitleValue(): string {
    return this.titleInput.nativeElement.value;
  }
}
```

**Avantages :**
- ✅ Tests 3x plus courts
- ✅ 10x plus lisibles
- ✅ Changements de template isolés dans le PageModel
- ✅ Interface métier claire

### 3. **Fonctions utilitaires**

#### `setupTestBed<T>()`
```typescript
function setupTestBed<T>(
  component: Type<T>,
  providers: Provider[] = []
): ComponentFixture<T> {
  TestBed.overrideComponent(component, {
    set: { providers }
  });
  return TestBed.createComponent(component);
}
```

#### `getByText()`
```typescript
function getByText(
  root: HTMLElement,
  text: string,
  selector: string = '*'
): HTMLElement | null {
  const elements = Array.from(root.querySelectorAll(selector));
  return elements.find(el =>
    el.textContent?.trim().includes(text)
  ) as HTMLElement || null;
}
```

---

## 📖 Concepts TDD appliqués

### Le cycle TDD : Red → Green → Refactor

```
1. 🔴 RED : Écrire un test qui échoue
   ↓
2. 🟢 GREEN : Écrire le code minimum pour passer le test
   ↓
3. 🔵 REFACTOR : Améliorer le code sans casser les tests
   ↓
4. Répéter
```

### Les 3 règles du TDD (Uncle Bob)

1. **N'écris pas de code de production** tant que tu n'as pas un test qui échoue
2. **N'écris qu'un seul test** qui échoue à la fois
3. **N'écris que le code minimum** nécessaire pour faire passer le test

### Exemple de TDD dans ce projet

**Étape 1 : Test qui échoue (RED 🔴)**
```typescript
it('devrait créer un livre', (done) => {
  const newBook = { title: 'Test', author: 'Author' };
  const gateway = { createBook: vi.fn().mockReturnValue(of({ id: 1, ...newBook })) };
  const useCase = new CreateBookUseCase(gateway);

  useCase.execute(newBook).subscribe(result => {
    expect(result.id).toBeDefined();
    done();
  });
  // ❌ ÉCHOUE : CreateBookUseCase n'existe pas
});
```

**Étape 2 : Code minimum (GREEN 🟢)**
```typescript
export class CreateBookUseCase {
  constructor(private readonly gateway: CreateBookGateway) {}

  execute(book: Omit<Book, 'id'>): Observable<Book> {
    return this.gateway.createBook(book);
  }
}
// ✅ Test passe !
```

**Étape 3 : Refactoring (REFACTOR 🔵)**
```typescript
// Rien à refactorer ici, le code est déjà optimal
```

---

## 📊 Coverage des tests

Le projet vise une couverture de test de **100%** pour :

- ✅ **Use-cases** : 100%
- ✅ **Gateways** : 100%
- ✅ **Composants** : 95%+ (certains cas edge volontairement ignorés)

```bash
# Générer le rapport de coverage
npm run test:coverage

# Ouvrir le rapport HTML
open coverage/index.html
```

---

## 🎓 Concepts clés appris

### 1. Architecture hexagonale
- Séparation domaine / infrastructure / application
- Injection de dépendances via tokens
- Testabilité maximale

### 2. Tests unitaires
- Stubs vs Mocks
- `defer()` pour Observables
- `it.each()` pour tests paramétrés

### 3. Tests de composants
- TestBed et ComponentFixture
- Pattern PageModel
- Détection de changements

### 4. Tests HTTP
- HttpTestingController
- Vérification des requêtes
- Mock des réponses

### 5. Tests d'intégration
- Flux complets de bout en bout
- InMemoryGateway pour isolation
- Assertions multi-niveaux

### 6. Patterns de test
- Builder pour jeux de données
- PageModel pour abstraction du DOM
- Fonctions utilitaires réutilisables

---

## 📚 Ressources

### Documentation officielle
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Vitest Documentation](https://vitest.dev/)
- [RxJS Testing](https://rxjs.dev/guide/testing/marble-testing)

### Articles recommandés
- [Hexagonal Architecture in Angular](https://dev.to/angular/hexagonal-architecture-in-angular)
- [Testing Best Practices](https://testingangular.com/)
- [TDD by Example - Kent Beck](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)

### Cours suivi
- **EAK - Easy Angular Kit** : Module "Maîtriser les tests avec Vitest"
  - Test unitaire - premier pas avec Vitest
  - Test unitaire - mocker ses dépendances
  - Test de composant (1/2 et 2/2)
  - Des patterns utiles (Builder, PageModel)
  - Test de HttpClient
  - Test d'intégration
  - Boss de fin - TDD en pratique

---

## 👤 Auteur

Projet réalisé dans le cadre de la formation [**EAK - Easy Angular Kit**](https://easyangularkit.com?via=djoudj).

---

## 🙏 Remerciements

- ** GaetanRdn ** pour la formation EAK
- La communauté Angular pour les outils et patterns

---

<div align="center">

**⭐ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile ! ⭐**

</div>
