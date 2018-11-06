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

  selectSize(i: number) {
    this.generatorService.size = i === 0 ? 'Small' : i === 1 ? 'Medium' : 'Large';
    this.quantifyDimensions();
  }

  selectOrientation(option: number) {
    if (option === 0) {
      this.generatorService.orientationMultiplier = 1;
      this.generatorService.orientation = 'Portrait';
    } else {
      this.generatorService.orientationMultiplier = 1.5;
      this.generatorService.orientation = 'Landscape';
    }
    this.quantifyDimensions();
  }

  quantifyDimensions() {
    this.generatorService.posterWidth = this.generatorService.dimensions[this.generatorService.size].width * this.generatorService.orientationMultiplier;
    this.generatorService.posterHeight = this.generatorService.dimensions[this.generatorService.size].height / this.generatorService.orientationMultiplier;
  }
}
