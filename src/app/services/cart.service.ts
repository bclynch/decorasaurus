import { Injectable, Component, Inject, OnDestroy } from '@angular/core';
import { Moltin } from '../providers/moltin/moltin';
import { CustomerService } from './customer.service';
import { Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef } from '@angular/material';
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

  cart;
  public cartItems: Observable<any>;
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
    this.cartSubject = new BehaviorSubject<any[]>(null);
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
      console.log(this.customerService.customerUuid);
      this.getCartSubscription = this.apiService.getCartById(this.customerService.customerUuid).valueChanges.subscribe(({ data }) => {
        console.log(data.cartById);
        if (data.cartById) {
          this.cartSubject.next(data.cartById);
          resolve();
        } else {
          this.apiService.createCart(this.customerService.customerUuid).subscribe(
            (cart) => {
              console.log(cart);
              this.cartSubject.next(cart.data.createCart.cart);
              resolve();
            }
          );
        }
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
      (links: { type: 'thumbnail' | 'pdf', S3Url: string }[]) => {
        console.log(links);
        this.apiService.createCartItem(this.customerService.customerUuid, sku, quantity).subscribe(
          ({ data }) => {
            // bulk add links to post
            let query = `mutation {`;
            links.forEach((link, i) => {
                query += `a${i}: createProductLink(input: {
                  productLink: {
                    cartItemId: "${data.createCartItem.cartItem.id}",
                    orderItemId: null,
                    type: ${link.type === 'thumbnail' ? LinkType.THUMBNAIL : link.type === 'pdf' ? LinkType.PDF : LinkType.CROP},
                    url: "${link.S3Url}"
                  }
                }) {
                  query {
                    cartById(id: "${this.customerService.customerUuid}") {
                      cartItemsByCartId {
                        nodes {
                          id,
                          productSku,
                          quantity,
                          productLinksByCartItemId {
                            nodes {
                              type,
                              url,
                              id
                            }
                          },
                          productByProductSku {
                            name,
                            description,
                            productPricesByProductSku {
                              nodes {
                                amount,
                                currency
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }`;
            });
            query += `}`;

            this.apiService.genericCall(query).subscribe(
              (resp) => {
                console.log(resp);
                this.cartSubject.next(resp.data['a1'].query.cartById);
                this.generatorService.isAddingToCart = false;

                this.bottomSheet.open(AddCartNav, {
                  data: this.generatorService.product.name,
                  hasBackdrop: false
                });
              },
              err => console.log(err)
            );
          }
        );
      }
    );
  }

  removeFromCart(product): void {
    this.removeFromCartSubscription = this.apiService.removeCartItem(product.id, this.customerService.customerUuid).subscribe(
      ({ data }) => {
        this.cartSubject.next(data.updateCartItemById.query.cartById);
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
    console.log(cart);
    if (cart) {
      let total = 0;
      cart.forEach((item) => total += this.utilService.displayPrice(item.productByProductSku) * item.quantity);
      return total;
    }
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
