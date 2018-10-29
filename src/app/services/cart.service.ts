import { Injectable, Component, Inject } from '@angular/core';
import { Moltin } from '../providers/moltin/moltin';
import { UserService } from './user.service';
import { MoltinCart, MoltinCartItem } from '../providers/moltin/models/cart';
import { Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart: MoltinCart;
  cartItems: MoltinCartItem[];

  constructor(
    private moltin: Moltin,
    private userService: UserService,
    private router: Router,
    private bottomSheet: MatBottomSheet
  ) { }

  getCart() {
    this.moltin.getCart(this.userService.userUuid).subscribe(
      (data => {
        const anyData: any = data;
        this.cart = anyData.data;

        this.getCartItems();
      })
    );
  }

  getCartItems() {
    this.moltin.getCartItems(this.userService.userUuid).subscribe(
      (data => {
        console.log(data);
        const anyData: any = data;
        this.cartItems = anyData.data;
      })
    );
  }

  addToCart(product) {
    this.moltin.addToCart(this.userService.userUuid, product).subscribe(
      (data => {
        console.log(data);
        this.cartItems = data.data;
        // const anyData: any = data;
        // this.cartItems = anyData.data;

        this.bottomSheet.open(AddCartNav, {
          data: { product },
          hasBackdrop: false
        });

        // this.router.navigateByUrl('/cart');
      })
    );
  }
}

@Component({
  selector: 'app-add-cart-nav',
  template: `
    <div class="wrapper">
      <div>"{{data.product.name}}" was added to your cart.</div>
      <div class="btnRow">
        <button mat-button (click)="navigate('/cart')">View Cart</button>
        <button mat-button (click)="navigate('/checkout')">Go To Checkout</button>
      </div>
      <mat-icon (click)="matBottomSheetRef.dismiss()">close</mat-icon>
    </div>
  `,
  styles: [
    `
      .wrapper {
        padding: 10px;
      }
      .btnRow {
        float: right;
      }
      mat-icon {
        position: absolute;
        right: 5px;
        top: 5px;
        cursor: pointer;
        font-size: 20px;
      }
    `
  ]
})
export class AddCartNav {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public matBottomSheetRef: MatBottomSheetRef<AddCartNav>,
    private router: Router
  ) {

  }

  navigate(path: string) {
    this.matBottomSheetRef.dismiss();
    this.router.navigateByUrl(`/${path}`);
  }
}
