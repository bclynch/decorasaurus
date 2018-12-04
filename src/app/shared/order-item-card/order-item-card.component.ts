import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-order-item-card',
  templateUrl: './order-item-card.component.html',
  styleUrls: ['./order-item-card.component.scss']
})
export class OrderItemCardComponent implements OnInit {
  @Input() product;

  thumbnail: string;

  constructor() { }

  ngOnInit() {
    this.thumbnail = this.product.productLinksByOrderItemId.nodes[0].url;
  }

}
