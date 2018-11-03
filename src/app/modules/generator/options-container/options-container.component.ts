import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MoltinProduct } from '../../../providers/moltin/models/product';
import { Moltin } from '../../../providers/moltin/moltin';
import { CustomerService } from 'src/app/services/customer.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-options-container',
  templateUrl: './options-container.component.html',
  styleUrls: ['./options-container.component.scss']
})
export class OptionsContainerComponent implements OnInit {
  @Input() generatorType: string;
  @Input() product: MoltinProduct;
  @Output() posterSVG: EventEmitter<SafeUrl> = new EventEmitter<SafeUrl>();
  @Output() tracing: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() posterBackground: EventEmitter<string> = new EventEmitter<string>();
  @Output() posterWidth: EventEmitter<number> = new EventEmitter<number>();
  @Output() posterHeight: EventEmitter<number> = new EventEmitter<number>();
  @Output() addToCart: EventEmitter<void> = new EventEmitter<void>();

  navTabs = ['Basics', 'Customize', 'Finish'];
  selectedTab = 0;
  mobileOptionsActive = false;

  // poster options
  background = 'blue';
  trace = 'white';
  orientationMultiplier = 1;
  orientationOptions = ['Portrait', 'Landscape'];
  orientation: 'Portrait' | 'Landscape' = 'Portrait';
  // posterWidth = 12; // inches
  // posterHeight = 18; // inches
  dimensions = {
    Small: {
      width: 8,
      height: 12
    },
    Medium: {
      width: 12,
      height: 18
    },
    Large: {
      width: 18,
      height: 27
    }
  };
  size: 'Small' | 'Medium' | 'Large' = 'Medium';
  sizeOptions = ['Small', 'Medium', 'Large'];

  // patent props
  patentSearchResults: string[];
  patentName: string;

  constructor(
    private _DomSanitizationService: DomSanitizer,
    private moltin: Moltin,
    private customerService: CustomerService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    // give generator initial background in case not user changed. Might be better to house it there...
    // this.posterBackground.emit(this.background);
  }

  selectTab(index: number) {
    this.selectedTab = index;
  }

  selectSize(i: number) {
    this.size = i === 0 ? 'Small' : i === 1 ? 'Medium' : 'Large';
    this.quantifyDimensions();
  }

  selectOrientation(option: number) {
    if (option === 0) {
      this.orientationMultiplier = 1;
      this.orientation = 'Portrait';
    } else {
      this.orientationMultiplier = 1.5;
      this.orientation = 'Landscape';
    }
    this.quantifyDimensions();
  }

  quantifyDimensions() {
    this.posterWidth.emit(this.dimensions[this.size].width * this.orientationMultiplier);
    this.posterHeight.emit(this.dimensions[this.size].height / this.orientationMultiplier);
  }

  cleanSVG(svg: string) {
    this.tracing.emit(false);
    this.posterBackground.emit(this.background);
    this.posterSVG.emit(svg);
  }

  beginTracing() {
    this.tracing.emit(true);
    this.posterSVG.emit(null);
    this.mobileOptionsActive = false;
  }

  backgroundChange(color: string) {
    this.background = color;
    this.posterBackground.emit(color);
  }
}
