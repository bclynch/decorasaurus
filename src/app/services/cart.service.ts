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

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnDestroy {

  getCartSubscription: SubscriptionLike;
  cartItemsSubscription: SubscriptionLike;
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
    private generatorService: GeneratorService
  ) {
    this.cartSubject = new BehaviorSubject<MoltinCartItem[]>(null);
    this.cartItems = this.cartSubject;
  }

  ngOnDestroy() {
    this.getCartSubscription.unsubscribe();
    this.cartItemsSubscription.unsubscribe();
    this.addToCartSubscription.unsubscribe();
    this.removeFromCartSubscription.unsubscribe();
    this.updateCartSubscription.unsubscribe();
  }

  getCart(): Promise<void> {
    return new Promise((resolve) => {
      this.getCartSubscription = this.moltin.getCart(this.customerService.customerUuid).subscribe(
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
      this.cartItemsSubscription = this.moltin.getCartItems(this.customerService.customerUuid).subscribe(
        (data => {
          this.cartSubject.next(data);
          resolve();
        })
      );
    });
  }

  addToCart(product: MoltinProduct, blob: Blob, background: string): void {
    const formData = new FormData();
    formData.append('poster', blob);
    formData.append('background', background);
    formData.append('orientation', this.generatorService.orientation);
    formData.append('size', this.generatorService.size);
    // Need to create thumbnail for product + pdf to s3 then add to cart
    this.apiService.processPoster(formData).subscribe(
      (result: { type: 'thumbnail' | 'pdf', S3Url: string }[]) => {
        console.log(result);
        // product.thumbnail_url = result.filter((link) => link.type === 'thumbnail')[0].S3Url;
        // product.pdf_url = result.filter((link) => link.type === 'pdf')[0].S3Url;
        console.log(product);
        this.addToCartSubscription = this.moltin.addToCart(this.customerService.customerUuid, product).subscribe(
          (data => {
            console.log(data);

            // append links to cart items
            // this.moltin.

            this.cartSubject.next(data);

            this.bottomSheet.open(AddCartNav, {
              data: { product },
              hasBackdrop: false
            });
          })
        );
      }
    );
  }

  addCustomToCart(product: MoltinProduct, blob: Blob, background: string): void {
    const formData = new FormData();
    formData.append('poster', blob);
    formData.append('background', background);
    formData.append('orientation', this.generatorService.orientation);
    formData.append('size', this.generatorService.size);
    // Need to create thumbnail for product + pdf to s3 then add to cart
    this.apiService.processPoster(formData).subscribe(
      (result: { type: 'thumbnail' | 'pdf', S3Url: string }[]) => {
        console.log(result);
        console.log(product);
        const item = {
          name: `My ${Date.now().toString()} Item`,
          sku: Date.now().toString(),
          description: 'My first custom item!',
          thumbnail_url: result.filter((link) => link.type === 'thumbnail')[0].S3Url,
          pdf_url: result.filter((link) => link.type === 'pdf')[0].S3Url,
          quantity: 1,
          price: {
            amount: 10000
          }
        };
        console.log(item);
        this.addToCartSubscription = this.moltin.addCustomToCart(this.customerService.customerUuid, item).subscribe(
          (derp) => {
            console.log(derp);

            this.cartSubject.next(derp);

            this.bottomSheet.open(AddCartNav, {
              data: { product },
              hasBackdrop: false
            });
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

  updateCartItem(product: MoltinCartItem, quantity: number) {
    this.updateCartSubscription = this.moltin.updateCartItem(this.customerService.customerUuid, product.id, quantity).subscribe(
      (data) => {
        this.cartSubject.next(data);
      }
    );
  }

  applyPromoCode(code) {
    this.moltin.applyPromoCode(this.customerService.customerUuid, code).subscribe(
      (data) => this.cartSubject.next(data)
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
