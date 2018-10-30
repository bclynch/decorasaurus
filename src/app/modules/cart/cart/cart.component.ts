import { Component, OnInit, Inject } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { SettingsService } from 'src/app/services/settings.service';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { MoltinCartItem, MoltinCartResp } from 'src/app/providers/moltin/models/cart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

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

  constructor(
    private cartService: CartService,
    private settingsService: SettingsService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {
    this.settingsService.appInited.subscribe((inited) =>  { if (inited) this.init(); });
  }

  ngOnInit() {
  }

  init(): void {
    this.cartService.cartItems.subscribe(
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

  remove(product: MoltinCartItem): void {
    this.cartService.removeFromCart(product);
    this.snackBar.openFromComponent(RemoveSnackbar, {
      duration: 3000,
      verticalPosition: 'top',
      data: { product }
    });
  }

  recalcQuant(e: Event, product: MoltinCartItem, index: number) {
    e.preventDefault();
    if (product.quantity > 0) this.cartService.updateCartItem(product, this.cart.data[index].quantity);
  }
}

@Component({
  selector: 'app-remove-snackbar',
  template: `
    <div>
      Succesfully removed "{{data.product.name}}"
    </div>
  `,
  styles: [
    `

    `
  ]
})
export class RemoveSnackbar {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {

  }
}
