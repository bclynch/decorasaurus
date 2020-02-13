import { Injectable, Component, Inject } from '@angular/core';
import { CustomerService } from './customer.service';
import { Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { BehaviorSubject, Observable, SubscriptionLike} from 'rxjs';
import { APIService } from './api.service';
import { GeneratorService } from './generator.service';
import { UtilService } from './util.service';
import {
  ProductSize,
  ProductOrientation,
  LinkType,
  CreateCartItemGQL,
  CreateCartGQL,
  RemoveCartItemByIdGQL,
  UpdateCartItemByIdGQL,
  CartByIdGQL,
  CartById
} from '../generated/graphql';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart: CartById.CartById;
  public cartItems: Observable<any>;
  private cartSubject: BehaviorSubject<any>;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private apiService: APIService,
    private generatorService: GeneratorService,
    private utilService: UtilService,
    private createCartItemGQL: CreateCartItemGQL,
    private createCartGQL: CreateCartGQL,
    private removeCartItemByIdGQL: RemoveCartItemByIdGQL,
    private updateCartItemByIdGQL: UpdateCartItemByIdGQL,
    private cartByIdGQL: CartByIdGQL
  ) {
    this.cartSubject = new BehaviorSubject<any[]>(null);
    this.cartItems = this.cartSubject;
  }

  getCart(): Promise<void> {
    return new Promise((resolve) => {
      console.log(this.customerService.customerUuid);

      this.cartByIdGQL.fetch({ cartId: this.customerService.customerUuid })
        .pipe(
          map(result => {
            if (result.data.cartById) {
              this.cartSubject.next(result.data.cartById);
              resolve();
            } else {
              this.createCart().then(
                () => resolve()
              );
            }
          })
        );
    });
  }

  createCart() {
    return new Promise((resolve) => {
      this.createCartGQL.mutate({ cartId: this.customerService.customerUuid })
        .subscribe(
          (cart) => {
            this.cartSubject.next(cart.data.createCart.cart);
            resolve();
          }
        );
    });
  }

  addToCart(sku: string, quantity: number, dataUrl: string, size: ProductSize, orientation: ProductOrientation, fusionType: 'udnie' | 'rain_princess' | 'scream' | 'wave' | 'wreck' | 'la_muse', fontColor: string, backgroundColor: string, titleText: string, subtitleText: string, tagText: string, useLabel: boolean): void {
    const formData = new FormData();
    formData.append('poster', dataUrl);
    formData.append('orientation', this.generatorService.orientation);
    formData.append('size', this.generatorService.size);
    formData.append('crop', this.generatorService.generatorType === 'fusion-poster' ? this.generatorService.fusionCropped : 'undefined');
    // return;
    // Need to create thumbnail for product + pdf to s3 then add to cart
    this.apiService.processPoster(formData).subscribe(
      (links: any) => {
        console.log(links);

        this.createCartItemGQL.mutate({ cartId: this.customerService.customerUuid, productSku: sku, quantity, size, orientation, fusionType, fontColor, backgroundColor, titleText, subtitleText, tagText, useLabel })
          .subscribe(
            (result) => {
              // bulk add links to post
              let query = `mutation {`;
              links.forEach((link, i) => {
                  query += `a${i}: createProductLink(input: {
                    productLink: {
                      cartItemId: "${result.data.createCartItem.cartItem.id}",
                      orderItemId: null,
                      type: ${link.type === 'thumbnail' ? LinkType.Thumbnail : link.type === 'pdf' ? LinkType.Pdf : LinkType.Crop},
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
    this.removeCartItemByIdGQL.mutate({ cartItemId: product.id, cartId: this.customerService.customerUuid })
      .subscribe(
        (result) => this.cartSubject.next(result.data.updateCartItemById.query.cartById)
      );
  }

  updateCartItem(product, quantity: number) {
    this.updateCartItemByIdGQL.mutate({ cartItemId: product.id, quantity })
      .subscribe(
        (result) => this.cartSubject.next(result.data.updateCartItemById.cartByCartId)
      );
  }

  applyPromoCode(code) {

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
