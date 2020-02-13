import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-cart-totals',
  templateUrl: './cart-totals.component.html',
  styleUrls: ['./cart-totals.component.scss']
})
export class CartTotalsComponent implements OnInit, OnChanges {
  @Input() cart;

  subTotal: number;

  constructor(
    private cartService: CartService,
    public customerService: CustomerService
  ) { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.subTotal = this.cartService.quantifyCartTotal(this.cart);
  }
}
