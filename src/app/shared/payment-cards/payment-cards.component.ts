import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StripeService } from 'src/app/services/stripe.service';

@Component({
  selector: 'app-payment-cards',
  templateUrl: './payment-cards.component.html',
  styleUrls: ['./payment-cards.component.scss']
})
export class PaymentCardsComponent implements OnInit {
  @Input() canDelete = false;
  @Input() canMakeDefault = false;
  @Input() canSelect = false;
  @Output() selected: EventEmitter<void> = new EventEmitter<void>();

  selectedCard;

  constructor(
    public stripeService: StripeService
  ) { }

  ngOnInit() {
  }

  selectCard() {
    this.stripeService.selectedCard = this.selectedCard;
    console.log(this.selectedCard);
    this.selected.emit();
  }
}
