import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';

// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { TranslationComponent } from './components/translation/translation.component';

// import Routes module
import { Routes, RouterModule } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

// import Ng bootstrap module (using hear for pagination)
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// define the routes. Order of routes is important. First match wins. Start from most specific to generic
const routes: Routes = [
 {path: 'products/:id', component: ProductDetailsComponent},
 {path: 'search/:keyword', component: ProductListComponent},
 {path: 'category/:id', component: ProductListComponent},
 {path: 'category', component: ProductListComponent},
 {path: 'products', component: ProductListComponent},
 {path: '', redirectTo: '/products', pathMatch: 'full'},
 // path: '**'. The generic wild card. It will match on anything that didn't match above routes.
 {path: '**', redirectTo: '/products', pathMatch: 'full'},
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    TranslationComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent
  ],
  imports: [
    // Configure Router based on our routes
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    // Configure Translation module.
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    // Ng-bootstrap module
    NgbModule
  ],
  providers: [ProductService],
  // import bootstrap directly on project instead of the classic html header import method
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
