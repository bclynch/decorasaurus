import { Injectable, Component, Inject } from '@angular/core';
import { Moltin } from '../providers/moltin/moltin';
import { UserService } from './user.service';
import { MoltinCart, MoltinCartItem, MoltinCartMeta, MoltinCartResp } from '../providers/moltin/models/cart';
import { Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { MoltinProduct } from '../providers/moltin/models/product';
import { BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart: MoltinCart;
  public cartItems: Observable<MoltinCartResp>;
  private cartSubject: BehaviorSubject<any>;

  constructor(
    private moltin: Moltin,
    private userService: UserService,
    private router: Router,
    private bottomSheet: MatBottomSheet
  ) {
    this.cartSubject = new BehaviorSubject<MoltinCartItem[]>(null);
    this.cartItems = this.cartSubject;
  }

  getCart(): Promise<void> {
    return new Promise((resolve) => {
      this.moltin.getCart(this.userService.userUuid).subscribe(
        (data => {
          const anyData: any = data;
          this.cart = anyData.data;

          this.getCartItems().then(
            () => resolve()
          );
        })
      );
    });
  }

  getCartItems(): Promise<void> {
    return new Promise((resolve) => {
      this.moltin.getCartItems(this.userService.userUuid).subscribe(
        (data => {
          this.cartSubject.next(data);
          resolve();
        })
      );
    });
  }

  addToCart(product: MoltinProduct): void {
    this.moltin.addToCart(this.userService.userUuid, product).subscribe(
      (data => {
        console.log(data);
        this.cartSubject.next(data);

        this.bottomSheet.open(AddCartNav, {
          data: { product },
          hasBackdrop: false
        });
      })
    );
  }

  removeFromCart(product: MoltinCartItem): void {
    this.moltin.deleteCartItem(this.userService.userUuid, product.id).subscribe(
      (data) => {
        this.cartSubject.next(data);
      }
    );
  }

  updateCartItem(product: MoltinCartItem, quantity: number) {
    this.moltin.updateCartItem(this.userService.userUuid, product.id, quantity).subscribe(
      (data) => {
        this.cartSubject.next(data);
      }
    );
  }
}

@Component({
  selector: 'app-add-cart-nav',
  template: `
    <div class="wrapper">
      <div>"{{data.product.name}}" was added to your cart.</div>
      <div class="btnRow">
        <button mat-button (click)="navigate('/cart')" color="primary">View Cart</button>
        <button mat-button (click)="navigate('/checkout')" color="primary">Go To Checkout</button>
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
