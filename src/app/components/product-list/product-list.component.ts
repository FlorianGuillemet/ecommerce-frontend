import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string;
  searchMode: boolean = false;

  // properties for pagination
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;

  previousKeyword: string = null;

  constructor(private productService: ProductService,
              // Inject the ActivatedRoute to know the current active route that loaded the component.
              // Usefull for accessing route parameters
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(): void {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    this.searchMode
      ? this.handleSearchProducts()
      : this.handleListProducts();

  }

  private handleListProducts(): void {

    // check if "id parameter is available on the route".
    // "route" is the activated route.
    // "snapshot": is the state of route at this given moment in time.
    // "paramMap": map of all the route parameters.
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. And convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      this.currentCategoryId = 1;
    }

    // check if we have a different category than previous
    // if we have a different category id than previous
    // then set pageNumber back to 1
    if (this.previousCategoryId !== this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    // get the products for the given category id.
    this.productService.getProductListByCategoryPaginate(this.pageNumber - 1,
                                                        this.pageSize,
                                                        this.currentCategoryId)
                                                        .subscribe(this.processResult());


    // get the product name (to display it on top of the page).
    this.productService.getProductCategory(this.currentCategoryId).subscribe(
      data => {
        this.currentCategoryName = data.categoryName;
      }
    );
  }

  private handleSearchProducts(): void {

    // get the keyword pass in param
    const searchKeyword = this.route.snapshot.paramMap.get('keyword');

    // if we have a different keyword than previous, then set pageNumber to 1
    if (this.previousKeyword !== searchKeyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = searchKeyword;

    // get the Products will match with the keyword
    this.productService.getSearchProductsPaginate(this.pageNumber - 1,
                                                  this.pageSize,
                                                  searchKeyword)
                                                  .subscribe(this.processResult());
  }

  private processResult(): any {
    return data => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }
}
