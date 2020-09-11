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

  computeCartTotals(): void {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (const cartItem of this.cartItems) {
      cartItem.subTotal = cartItem.quantity * cartItem.unitPrice;
      totalPriceValue += cartItem.subTotal;
      totalQuantityValue += cartItem.quantity;
    }

    // publish/send the new values ... all the subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

  decrementQuantity(cartItem: CartItem): void {

    cartItem.quantity --;

    if (cartItem.quantity === 0) {
      this.removeCartItem(cartItem);
    } else {
      this.computeCartTotals();
    }
  }

  removeCartItem(cartItem: CartItem): void {

    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(eachCartItem => eachCartItem.id === cartItem.id);

    // if found, remove the item from the array at the given index
    if ( itemIndex >= 0 ) {
      this.cartItems.splice(itemIndex, 1);
    }

    this.computeCartTotals();
  }

}
