import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GeneratorService } from 'src/app/services/generator.service';
import { SubscriptionLike } from 'rxjs';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-options-container',
  templateUrl: './options-container.component.html',
  styleUrls: ['./options-container.component.scss']
})
export class OptionsContainerComponent implements OnInit {
  @Output() addToCart: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private generatorService: GeneratorService,
    private utilService: UtilService,
    private customerService: CustomerService
  ) {

  }

  ngOnInit() {
  }
}
