import { Component, OnInit, Input, Inject } from '@angular/core';
import { MoltinCartItem } from 'src/app/providers/moltin/models/cart';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-item-card',
  templateUrl: './cart-item-card.component.html',
  styleUrls: ['./cart-item-card.component.scss']
})
export class CartItemCardComponent implements OnInit {
  @Input() product: MoltinCartItem;
  @Input() isCheckout = false;

  constructor(
    public snackBar: MatSnackBar,
    private cartService: CartService
  ) { }

  ngOnInit() {
  }

  remove(product: MoltinCartItem): void {
    this.cartService.removeFromCart(product);
    this.snackBar.openFromComponent(RemoveSnackbar, {
      duration: 3000,
      verticalPosition: 'top',
      data: { product },
      panelClass: ['snackbar-theme']
    });
  }

  recalcQuant(e: Event, product: MoltinCartItem, index: number) {
    e.preventDefault();
    if (product.quantity > 0) this.cartService.updateCartItem(product, this.product.quantity);
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
