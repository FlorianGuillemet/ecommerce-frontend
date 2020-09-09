import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// CartService is the Observable and CartStatus is the Observator component.
export class CartService {

  cartItems: CartItem[] = [];

  // Subject is a subclass of Observable. We can use Subject to publish events in our code.
  // the event will be sent to all of the subscribers.
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();


  constructor() { }


  addToCart(cartItemSubmit: CartItem): void {
    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem;

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id
      // Method Find return the first element in an array that passes a given test
      existingCartItem = this.cartItems.find( cartItem => cartItem.id === cartItemSubmit.id );
      /*
      for (const cartItem of this.cartItems) {
        if (cartItemSubmit.id === cartItem.id) {
          existingCartItem = cartItem;
          break;
        }
      }
      */
      // check if we found it
      alreadyExistsInCart = (existingCartItem !== undefined);
    }

    if (alreadyExistsInCart) {
      // increment the quantity
      existingCartItem.quantity++;
    } else {
      // just add the item to the array
      this.cartItems.push(cartItemSubmit);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();

  }

  private computeCartTotals(): void {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (const cartItem of this.cartItems) {
      totalPriceValue += cartItem.quantity * cartItem.unitPrice;
      totalQuantityValue += cartItem.quantity;
    }

    // publish/send the new values ... all the subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

}
