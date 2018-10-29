import { Component, OnInit } from '@angular/core';

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
      number: 0
    },
    {
      icon: 'bookmarks',
      label: 'Wish List',
      number: 0
    }
  ];
  products = [];

  constructor() { }

  ngOnInit() {
  }

}
