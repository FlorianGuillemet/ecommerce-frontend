import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';


  constructor(private httpClient: HttpClient) { }


  getProductList(): Observable<Product[]> {

    // Return an Observable of Products Array. Maps the JSON data from Spring Data REST to a Product array
    return this.httpClient.get<GetResponseProducts>(this.baseUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getSearchProducts(keyword: string): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;

    return this.getProducts(searchUrl);
  }

  getProductListByCategory(categoryId: number): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategories>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getProductCategory(categoryId: number): Observable<ProductCategory> {

    const searchUrl = `${this.categoryUrl}/${categoryId}`;

    // don't need the map to unwrap the JSON because he contains the searching entity directly.
    return this.httpClient.get<ProductCategory>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

// Interface to unwraps the JSON from Spring Data REST _embedded entry
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
}

interface GetResponseProductCategories {
  _embedded: {
    productCategory: ProductCategory[];
  };
}

