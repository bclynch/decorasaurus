import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { SettingsService } from 'src/app/services/settings.service';

import { MoltinCartItem, MoltinCartResp } from 'src/app/providers/moltin/models/cart';
import { Router } from '@angular/router';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  tabs = [
    {
      icon: 'shopping_cart',
      label: 'Shopping Cart',
      number: null
    },
    {
      icon: 'bookmarks',
      label: 'Wish List',
      number: 0
    }
  ];
  activeTab = 0;
  cart: MoltinCartResp;
  wishlistProducts = [];
  cartSubscription: SubscriptionLike;

  constructor(
    private cartService: CartService,
    private settingsService: SettingsService,
    private router: Router
  ) {
    this.settingsService.appInited.subscribe((inited) =>  { if (inited) this.init(); });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

  init(): void {
    this.cartSubscription = this.cartService.cartItems.subscribe(
      items => {
        console.log(items);
        this.cart = items;
        // this.products = items.data;
        let quant = 0;
        this.cart.data.forEach((product) => quant += product.quantity);
        this.tabs[0].number = quant;
      }
    );
  }
}
