import { Injectable, Component, Inject, OnDestroy } from '@angular/core';
import { Moltin } from '../providers/moltin/moltin';
import { CustomerService } from './customer.service';
import { MoltinCart, MoltinCartItem, MoltinCartMeta, MoltinCartResp } from '../providers/moltin/models/cart';
import { Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { MoltinProduct } from '../providers/moltin/models/product';
import { BehaviorSubject, Observable, SubscriptionLike} from 'rxjs';
import { APIService } from './api.service';
import { GeneratorService } from './generator.service';

import { LinkType } from '../api/mutations/cart.mutation';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnDestroy {

  getCartSubscription: SubscriptionLike;
  addToCartSubscription: SubscriptionLike;
  removeFromCartSubscription: SubscriptionLike;
  updateCartSubscription: SubscriptionLike;

  cart: MoltinCart;
  public cartItems: Observable<MoltinCartResp>;
  private cartSubject: BehaviorSubject<any>;

  constructor(
    private moltin: Moltin,
    private customerService: CustomerService,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private apiService: APIService,
    private generatorService: GeneratorService,
    private utilService: UtilService
  ) {
    this.cartSubject = new BehaviorSubject<MoltinCartItem[]>(null);
    this.cartItems = this.cartSubject;
  }

  ngOnDestroy() {
    this.getCartSubscription.unsubscribe();
    this.addToCartSubscription.unsubscribe();
    this.removeFromCartSubscription.unsubscribe();
    this.updateCartSubscription.unsubscribe();
  }

  getCart(): Promise<void> {
    return new Promise((resolve) => {
      this.getCartSubscription = this.apiService.getCartById(this.customerService.customerUuid).valueChanges.subscribe(({ data }) => {
        console.log(data);
        this.cartSubject.next(data.cartById);
        resolve();
      });
    });
  }

  addToCart(sku: string, quantity: number, dataUrl: string): void {
    const formData = new FormData();
    formData.append('poster', dataUrl);
    formData.append('orientation', this.generatorService.orientation);
    formData.append('size', this.generatorService.size);
    // Need to create thumbnail for product + pdf to s3 then add to cart
    this.apiService.processPoster(formData).subscribe(
      (result: { type: 'thumbnail' | 'pdf', S3Url: string }[]) => {
        console.log(result);
        // console.log(product);
        // const item = {
        //   name: `My ${Date.now().toString()} Item`,
        //   sku: Date.now().toString(),
        //   description: 'My first custom item!',
        //   thumbnail_url: result.filter((link) => link.type === 'thumbnail')[0].S3Url,
        //   pdf_url: result.filter((link) => link.type === 'pdf')[0].S3Url,
        //   crop_url: '',
        //   quantity: 1,
        //   price: {
        //     amount: 10000
        //   }
        // };
        this.apiService.createCartItem(this.customerService.customerUuid, sku, quantity).subscribe(
          ({ data }) => {
            console.log(data);
            this.cartSubject.next(data.createCartItem.cartByCartId);

            this.apiService.createProductLink(data.createCartItem.cartItem.id, null, LinkType.PDF, result.filter((link) => link.type === 'pdf')[0].S3Url).subscribe(
              () => {
                this.generatorService.isAddingToCart = false;

                this.bottomSheet.open(AddCartNav, {
                  data: this.generatorService.product.name,
                  hasBackdrop: false
                });
              }
            );
          }
        );
      }
    );
  }

  removeFromCart(product: MoltinCartItem): void {
    this.removeFromCartSubscription = this.moltin.deleteCartItem(this.customerService.customerUuid, product.id).subscribe(
      (data) => {
        this.cartSubject.next(data);
      }
    );
  }

  updateCartItem(product, quantity: number) {
    this.apiService.updateCartItem(product.id, quantity).subscribe(
      ({ data }) => {
        this.cartSubject.next(data.updateCartItemById.cartByCartId);
      }
    );
  }

  applyPromoCode(code) {
    this.moltin.applyPromoCode(this.customerService.customerUuid, code).subscribe(
      (data) => this.cartSubject.next(data)
    );
  }

  quantifyCartTotal(cart): number {
    let total = 0;
    cart.forEach((item) => total += this.utilService.displayPrice(item.productByProductSku) * item.quantity);
    return total;
  }
}

@Component({
  selector: 'app-add-cart-nav',
  template: `
    <div class="wrapper">
      <div>"{{data}}" was added to your cart.</div>
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
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: string,
    public matBottomSheetRef: MatBottomSheetRef<AddCartNav>,
    private router: Router
  ) {

  }

  navigate(path: string) {
    this.matBottomSheetRef.dismiss();
    this.router.navigateByUrl(`/${path}`);
  }
}
