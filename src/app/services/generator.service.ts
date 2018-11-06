import { Injectable } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { MoltinProduct } from '../providers/moltin/models/product';
declare let ml5: any;

@Injectable()
export class GeneratorService {

  generatorType: string;
  mobileOptionsActive = false;
  product: MoltinProduct;
  posterElement;

  // poster props
  backgroundColor = 'white';
  traceColor = 'purple';
  posterWidth = 12; // inches
  posterHeight = 18; // inches
  posterBlob: Blob;
  posterSrc;
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
  orientationMultiplier = 1;
  orientationOptions = ['Portrait', 'Landscape'];
  orientation: 'Portrait' | 'Landscape' = 'Portrait';

  // patent props
  patentSearchResults: string[];
  patentName: string;
  patentImages: string[];
  patentNumber: string;

  public tracing: Observable<boolean>;
  public tracingSubject: BehaviorSubject<boolean>;
  public optionsTab: Observable<number>;
  public optionsTabSubject: BehaviorSubject<number>;

  constructor(

  ) {
    this.tracingSubject = new BehaviorSubject<boolean>(false);
    this.tracing = this.tracingSubject;
    this.optionsTabSubject = new BehaviorSubject<number>(0);
    this.optionsTab = this.optionsTabSubject;
  }

  fuseImages(model: string) {
    this.tracingSubject.next(true);
    console.log(this.posterElement);
    ml5.styleTransfer(`assets/models/${model}`)
    .then(style => {
      // console.log(style.transfer(elem));
      style.transfer(this.posterElement).then((result) => {
        // this.style1RemixSubject.next(result.src);
        this.posterSrc = result.src;
        console.log(this.posterSrc);
        this.tracingSubject.next(false);
      });
    });
  }
}
