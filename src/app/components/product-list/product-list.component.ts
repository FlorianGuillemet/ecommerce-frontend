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

  products: Product[];
  currentCategoryId: number;
  currentCategoryName: string;
  searchMode: boolean;


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

  handleListProducts(): void {

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

    // get the products for the given category id.
    this.productService.getProductListByCategory(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    );

    // get the product name
    this.productService.getProductCategory(this.currentCategoryId).subscribe(
      data => {
        this.currentCategoryName = data.categoryName;
      }
    );
  }

  handleSearchProducts(): void {

    // get the keyword pass in param
    const searchKeyword = this.route.snapshot.paramMap.get('keyword');

    // get the Products will match with the keyword
    this.productService.getSearchProducts(searchKeyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }

}
