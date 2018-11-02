import { Component, OnInit, OnDestroy } from '@angular/core';
import { Moltin } from 'src/app/providers/moltin/moltin';
import { SubscriptionLike } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  paramsSubscription: SubscriptionLike;
  orderNumber: string;

  constructor(
    private moltin: Moltin,
    private route: ActivatedRoute,
  ) {
    this.paramsSubscription = this.route.params.subscribe((params) => {
      this.orderNumber = params.order;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

}
