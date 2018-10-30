import { Component, OnInit, Input } from '@angular/core';
import { MoltinCartResp } from 'src/app/providers/moltin/models/cart';

@Component({
  selector: 'app-cart-totals',
  templateUrl: './cart-totals.component.html',
  styleUrls: ['./cart-totals.component.scss']
})
export class CartTotalsComponent implements OnInit {
  @Input() cart: MoltinCartResp;

  constructor() { }

  ngOnInit() {
  }

}
