import { Injectable } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { MoltinProduct } from '../providers/moltin/models/product';
declare let ml5: any;

@Injectable()
export class GeneratorService {

  generatorType: string;
  remixType: 'fusion' | 'trace';
  mobileOptionsActive = false;
  product: MoltinProduct;
  posterElement;
  processingFusion = false;
  cropperImgUrl: string | ArrayBuffer;

  // poster props
  backgroundColor = 'white';
  traceColor = 'purple';
  posterWidth = 12; // inches
  posterHeight = 18; // inches
  posterBlob: Blob;
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
  patentName: string;
  patentImages: string[];
  patentNumber: string;

  // map props
  redStyle = 'mapbox://styles/bclynch/cjnen2de28pey2rrwy4z4ql7t';
  yellowStyle = 'mapbox://styles/bclynch/cjndjsgnu19kq2so4pwcsvtks';
  mapStyle = this.yellowStyle;
  mapCenter = [-74.0059728, 40.7127753];
  mapBounds;
  cityQuery: string;

  public tracing: Observable<boolean>;
  public tracingSubject: BehaviorSubject<boolean>;
  public optionsTab: Observable<number>;
  public optionsTabSubject: BehaviorSubject<number>;
  public posterSrc: Observable<string | SafeUrl>;
  public posterSrcSubject: BehaviorSubject<string | SafeUrl>;

  constructor(

  ) {
    this.tracingSubject = new BehaviorSubject<boolean>(false);
    this.tracing = this.tracingSubject;
    this.optionsTabSubject = new BehaviorSubject<number>(0);
    this.optionsTab = this.optionsTabSubject;
    this.posterSrcSubject = new BehaviorSubject<string | SafeUrl>(null);
    this.posterSrc = this.posterSrcSubject;
  }

  fuseImages(model: string) {
    this.tracingSubject.next(true);
    this.processingFusion = true;
    this.posterSrcSubject.next(null);
    ml5.styleTransfer(`assets/models/${model}`)
    .then(style => {
      // console.log(style.transfer(elem));
      style.transfer(this.posterElement).then((result) => {
        // this.style1RemixSubject.next(result.src);
        this.processingFusion = false;
        this.posterSrcSubject.next(result.src);
        this.tracingSubject.next(false);
      });
    });
  }

  selectSize(i: number) {
    this.size = i === 0 ? 'Small' : i === 1 ? 'Medium' : 'Large';
    this.quantifyDimensions();
  }

  selectOrientation(option: 'Portrait' | 'Landscape') {
    if (option === 'Portrait') {
      this.orientationMultiplier = 1;
      this.orientation = option;
    } else {
      this.orientationMultiplier = 1.5;
      this.orientation = option;
    }
    this.quantifyDimensions();
  }

  quantifyDimensions() {
    this.posterWidth = this.dimensions[this.size].width * this.orientationMultiplier;
    this.posterHeight = this.dimensions[this.size].height / this.orientationMultiplier;
  }
}
