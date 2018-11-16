import { Injectable } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { MoltinProduct } from '../providers/moltin/models/product';
import { Map } from 'mapbox-gl';
// import { saveAs } from 'file-saver';
declare let ml5: any;

@Injectable()
export class GeneratorService {

  generatorType: string;
  mobileOptionsActive = false;
  product: MoltinProduct;
  posterElement;
  processingFusion = false;
  cropperImgUrl: string | ArrayBuffer;
  isAddingToCart = false;

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
  public sizeSubject: BehaviorSubject<void>; // using to tell map to resize
  orientationMultiplier = 1;
  orientationOptions = ['Portrait', 'Landscape'];
  orientation: 'Portrait' | 'Landscape' = 'Portrait';
  public orientationSubject: BehaviorSubject<void>; // using to tell map to resize

  // overlay props
  overlayTitle = 'New York';
  overlaySubtitle = 'United States';
  overlayTag = '40.713° N / 74.006° W';
  overlayColor = 'black';
  overlayBackground = 'white';
  overlayType: 'Border' | 'Floating' | 'Block' = 'Block';
  displayOverlay = true;

  // patent props
  patentName: string;
  patentImages: string[];
  patentNumber: string;

  // map props
  redStyle = 'mapbox://styles/bclynch/cjnen2de28pey2rrwy4z4ql7t';
  yellowStyle = 'mapbox://styles/bclynch/cjndjsgnu19kq2so4pwcsvtks';
  mapStyle = this.redStyle;
  mapCenter = [-74.0059728, 40.7127753];
  mapBounds;
  cityQuery: string;

  // Print map props
  hiddenCenter;
  hiddenZoom;
  hiddenPitch;
  hiddenBearing;
  hiddenWidth;
  hiddenHeight;
  actualPixelRatio: number;
  public mapSubject: BehaviorSubject<string>;

  public tracing: Observable<boolean>;
  public tracingSubject: BehaviorSubject<boolean>;
  public optionsTab: Observable<number>;
  public optionsTabSubject: BehaviorSubject<number>;
  public posterSrc: Observable<string | SafeUrl>;
  public posterSrcSubject: BehaviorSubject<string | SafeUrl>;
  public croppingComplete: BehaviorSubject<boolean>;

  constructor(

  ) {
    this.tracingSubject = new BehaviorSubject<boolean>(false);
    this.tracing = this.tracingSubject;
    this.optionsTabSubject = new BehaviorSubject<number>(0);
    this.optionsTab = this.optionsTabSubject;
    this.posterSrcSubject = new BehaviorSubject<string | SafeUrl>(null);
    this.posterSrc = this.posterSrcSubject;
    this.mapSubject = new BehaviorSubject<string>(null);
    this.orientationSubject = new BehaviorSubject<void>(null);
    this.sizeSubject = new BehaviorSubject<void>(null);
    this.croppingComplete = new BehaviorSubject<boolean>(false);
  }

  fuseImages(model: string) {
    this.tracingSubject.next(true);
    this.processingFusion = true;
    this.posterSrcSubject.next(null);
    ml5.styleTransfer(`assets/models/${model}`)
    .then(style => {
      // console.log(style.transfer(elem));
      style.transfer(this.posterElement).then((result) => {
        this.processingFusion = false;
        this.posterSrcSubject.next(result.src);
        this.tracingSubject.next(false);
      });
    });
  }

  selectSize(option: 'Small' | 'Medium' | 'Large') {
    this.size = option;
    this.quantifyDimensions();
    this.sizeSubject.next(null);
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
    this.orientationSubject.next(null);
  }

  quantifyDimensions() {
    this.posterWidth = this.dimensions[this.size].width * this.orientationMultiplier;
    this.posterHeight = this.dimensions[this.size].height / this.orientationMultiplier;
  }

  generateMap(map: Map) {
    // toBlob method to create file
    // map.getCanvas().toBlob((blob) => {
    //   saveAs(blob, 'map.png');
    // });
    this.mapSubject.next(map.getCanvas().toDataURL());
  }
}
