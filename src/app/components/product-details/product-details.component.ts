import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  // instantiation of the property to avoid a "null pointer" in the console
  // that is generated before the data is assigned by the productService.
  product: Product = new Product();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      () => {
        this.handleProductDetails();
      }
    );
  }

  handleProductDetails(): void {

    // get the "id" param string. Convert string to a number using the "+" symbol.
    const productId: number = +this.activatedRoute.snapshot.paramMap.get('id');

    this.productService.getProduct(productId).subscribe(
      data => {
        this.product = data;
      }
    );
  }

  addToCart(product: Product): void {

    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
  }

}
