import { Component, OnInit, Input, Inject, OnChanges } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-cart-item-card',
  templateUrl: './cart-item-card.component.html',
  styleUrls: ['./cart-item-card.component.scss']
})
export class CartItemCardComponent implements OnInit, OnChanges {
  @Input() product;
  @Input() isCheckout = false;

  perEach: number;

  constructor(
    public snackBar: MatSnackBar,
    private cartService: CartService,
    private utilService: UtilService,
    private customerService: CustomerService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.perEach = this.utilService.displayPrice(this.product.productByProductSku);
  }

  remove(product): void {
    this.cartService.removeFromCart(product);
    this.snackBar.openFromComponent(RemoveSnackbar, {
      duration: 3000,
      verticalPosition: 'top',
      data: { product },
      panelClass: ['snackbar-theme']
    });
  }

  recalcQuant(e: Event, product, index: number) {
    e.preventDefault();
    if (product.quantity > 0) this.cartService.updateCartItem(product, this.product.quantity);
  }
}

@Component({
  selector: 'app-remove-snackbar',
  template: `
    <div>
      Succesfully removed "{{data.product.productByProductSku.name}}"
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
