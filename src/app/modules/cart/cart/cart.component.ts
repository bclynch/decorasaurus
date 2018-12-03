import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { SettingsService } from 'src/app/services/settings.service';

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
  cart;
  wishlistProducts = [];

  initSubscription: SubscriptionLike;
  cartSubscription: SubscriptionLike;

  constructor(
    private cartService: CartService,
    private settingsService: SettingsService,
    private router: Router
  ) {
    this.initSubscription = this.settingsService.appInited.subscribe((inited) =>  { if (inited) this.init(); });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
    this.initSubscription.unsubscribe();
  }

  init(): void {
    this.cartSubscription = this.cartService.cartItems.subscribe(
      (items: any) => {
        console.log(items);
        if (items) this.cart = items.cartItemsByCartId.nodes;
        if (items) this.tabs[0].number = items.cartItemsByCartId.nodes.length ? items.cartItemsByCartId.nodes.map((item) => item.quantity).reduce((x, y) => x + y) : 0;
      }
    );
  }
}
