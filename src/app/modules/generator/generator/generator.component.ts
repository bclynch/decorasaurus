import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Moltin } from '../../../providers/moltin/moltin';
import { CartService } from 'src/app/services/cart.service';
import { SubscriptionLike } from 'rxjs';
import * as domtoimage from 'dom-to-image';
import { GeneratorService } from 'src/app/services/generator.service';
import { SafeUrl } from '@angular/platform-browser';
import { Map } from 'mapbox-gl';

import { PrintMapComponent } from '../print-map/print-map.component';
import { UtilService } from 'src/app/services/util.service';


@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})

export class GeneratorComponent implements OnInit, OnDestroy {
  @ViewChild('hiddenMap', {read: ViewContainerRef}) hiddenMap: ViewContainerRef;

  paramsSubscription: SubscriptionLike;
  productSubscription: SubscriptionLike;
  tracingSubscription: SubscriptionLike;
  posterSourceSubscription: SubscriptionLike;
  mapSubscription: SubscriptionLike;
  orientationSubscription: SubscriptionLike;
  sizeSubscription: SubscriptionLike;

  tracing: boolean;
  productId: string;
  posterSrc: string | SafeUrl;
  posterSrcHidden: string | SafeUrl;

  // map props
  map: Map;
  center;
  pitch;
  zoom;
  bearing;
  mapWidth;
  mapHeight;
  displayHiddenMap = true;
  hiddenMapComponent;

  constructor(
    private route: ActivatedRoute,
    private moltin: Moltin,
    private cartService: CartService,
    private elRef: ElementRef,
    private generatorService: GeneratorService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private utilService: UtilService
  ) {
    this.paramsSubscription = this.route.params.subscribe((params) => {
      this.generatorService.generatorType = params.type;

      // resetting some props
      this.generatorService.mapBounds = null;
      this.generatorService.posterSrcSubject.next(null);
      this.generatorService.displayOverlay = this.generatorService.generatorType === 'map-poster';
      this.generatorService.croppingComplete.next(false);
      this.generatorService.cropperImgUrl = null;

      // identify product id
      switch (this.generatorService.generatorType) {
        case 'fusion-poster':
          this.productId = '34c1696a-6834-44f8-81a6-22922e6d9418';
          break;
        case 'patent-poster':
          this.productId = '19d80aa5-df4a-441b-939c-165957700240';
          // reset orientation in case they switched from a landscape fusion or something
          this.generatorService.orientation = 'Portrait';
          break;
        case 'map-poster':
          this.productId = 'c9d1a039-ed04-444d-a248-e213fca3acc0';
          this.generatorService.mapBounds = [[-73.9848829, 40.8235689], [-74.056895, 40.75737]]; // defaulting to NY currently
          break;
        case 'trace-poster':
          this.productId = '36aca78d-cdc5-46b2-96ff-1f6624f8eef6';
          break;
      }

      // fetch product info
      this.productSubscription = this.moltin.getProductById(this.productId).subscribe(product => {
        this.generatorService.product = product;
      });
    });

    this.tracingSubscription = this.generatorService.tracing.subscribe(
      tracing => this.tracing = tracing
    );

    this.posterSourceSubscription = this.generatorService.posterSrc.subscribe(
      src => {
        this.posterSrc = src;
        if (!this.generatorService.processingFusion) this.posterSrcHidden = src;
        this.generatorService.posterElement = this.elRef.nativeElement.querySelector('#inputImage');
      }
    );

    // if orientation of poster changes rerender map
    this.orientationSubscription = this.generatorService.orientationSubject.subscribe(
      // needs a timeout or it doesn't rerender
      () => { if (this.map) setTimeout(() => this.map.resize(), 50); }
    );

    // if size of poster changes rerender map
    this.sizeSubscription = this.generatorService.sizeSubject.subscribe(
      // needs a timeout or it doesn't rerender
      () => { if (this.map) setTimeout(() => this.map.resize(), 50); }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.productSubscription.unsubscribe();
    this.tracingSubscription.unsubscribe();
    this.posterSourceSubscription.unsubscribe();
    this.orientationSubscription.unsubscribe();
    this.sizeSubscription.unsubscribe();
  }

  addToCart() {
    // need spinner on add to cart btn
    this.generatorService.isAddingToCart = true;
    if (this.generatorService.generatorType === 'map-poster') {
      this.createPrintMap().then(
        (dataUrl) => {
          this.posterSrcHidden = dataUrl;
          setTimeout(() => this.captureImage(), 50); // timeout so the dom element can populate correctly
        }
      );
    } else {
      this.captureImage();
    }
  }

  createPrintMap(): Promise<string> {
    return new Promise((resolve) => {
      // set props for proper map rendering
      this.generatorService.actualPixelRatio = window.devicePixelRatio;
      Object.defineProperty(window, 'devicePixelRatio', {
          get: () => 300 / 96 // desired dpi / 96
      });
      this.generatorService.hiddenCenter = this.map.getCenter();
      this.generatorService.hiddenPitch = this.map.getPitch();
      this.generatorService.hiddenBearing = this.map.getBearing();
      this.generatorService.hiddenZoom = this.map.getZoom();
      this.generatorService.hiddenWidth = this.utilService.toPixels(this.generatorService.posterWidth);
      this.generatorService.hiddenHeight = this.utilService.toPixels(this.generatorService.posterHeight);

      // dynamically create map component
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(PrintMapComponent);
      this.hiddenMap.createComponent(componentFactory);

      this.mapSubscription = this.generatorService.mapSubject.subscribe(
        (dataUrl) => {
          if (dataUrl) {
            // destroy map + reset props
            this.hiddenMap.remove(0);
            Object.defineProperty(window, 'devicePixelRatio', {
              get: () => this.generatorService.actualPixelRatio // return pixel ratio to original
            });
            this.generatorService.mapSubject.next(null);
            this.mapSubscription.unsubscribe();
            resolve(dataUrl);
          }
        }
      );
    });
  }

  captureImage() {
    const node = this.elRef.nativeElement.querySelector('#poster');

    domtoimage.toPng(node)
      .then((png) => {
        // saveAs(blob, 'Student-Talks-poster.png'); -- Must be 'toBLob' not 'toPng
        this.cartService.addCustomToCart(this.generatorService.product, png);
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }
}
