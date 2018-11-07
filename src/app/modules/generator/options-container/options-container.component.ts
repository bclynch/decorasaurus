import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { GeneratorService } from 'src/app/services/generator.service';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-options-container',
  templateUrl: './options-container.component.html',
  styleUrls: ['./options-container.component.scss']
})
export class OptionsContainerComponent implements OnInit, OnDestroy {
  @Output() addToCart: EventEmitter<void> = new EventEmitter<void>();

  navTabs = ['Basics', 'Customize', 'Finish'];
  selectedTab = 0;
  tabSubscription: SubscriptionLike;

  constructor(
    private generatorService: GeneratorService
  ) {
    this.tabSubscription = this.generatorService.optionsTab.subscribe(
      (tab) => this.selectedTab = tab
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.tabSubscription.unsubscribe();
  }
}
