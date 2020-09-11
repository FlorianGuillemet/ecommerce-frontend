# AngularEcommerce

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Add Angular Language Service extension

https://angular.io/guide/language-service

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## use pagination support

ng add @angular/localize

## use bootstrap components for the pagination

npm install @ng-bootstrap/ng-bootstrap
and import NgbModule in imports:[] of app.module.ts file

## Principes
Le component appelé récupère les paramètres de la requête (exemple id ou name) puis appèle un service qui communique avec la BDD via un client Http

Le component souscrit ou s'abonne à un service (à une méthode ou une propriété d'un service) qui lui retourne un Observable. On affecte ensuite le retour de cette souscription à une propriété du component.
    ex:
    // get the product name (to display it on top of the page).
    ```this.productService.getProductCategory(this.currentCategoryId).subscribe(
      data => {
        this.currentCategoryName = data.categoryName;
      }
    );```

    // subscribe to the cart totalPrice
    ```this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice = data;
      }
    );```

## Plus
Component spécifique pour l'incrémentation et la diminution des quantités

Module de Traduction

Requete spécifique pour afficher le nom de catégorie dans le component Product list