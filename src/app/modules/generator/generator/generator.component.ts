import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { SubscriptionLike } from 'rxjs';
import * as domtoimage from 'dom-to-image';
import { GeneratorService } from 'src/app/services/generator.service';
import { SafeUrl } from '@angular/platform-browser';
import { Map } from 'mapbox-gl';

import { PrintMapComponent } from '../print-map/print-map.component';
import { UtilService } from 'src/app/services/util.service';
import { APIService } from 'src/app/services/api.service';
import { ProductSize, ProductOrientation } from 'src/app/api/mutations/cart.mutation';


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
  productSku: string;
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
    private cartService: CartService,
    private elRef: ElementRef,
    private generatorService: GeneratorService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private utilService: UtilService,
    private apiService: APIService
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
          this.productSku = 'fusion';
          break;
        case 'patent-poster':
          this.productSku = 'patent';
          // reset orientation in case they switched from a landscape fusion or something
          this.generatorService.orientation = 'Portrait';
          break;
        case 'map-poster':
          this.productSku = 'map';
          this.generatorService.mapBounds = [[-73.9848829, 40.8235689], [-74.056895, 40.75737]]; // defaulting to NY currently
          break;
        case 'trace-poster':
          this.productSku = 'trace';
          break;
      }

      // fetch product info
      this.productSubscription = this.apiService.getProductBySku(this.productSku).valueChanges.subscribe(({data}) => {
        console.log(data);
        this.generatorService.product = data.productBySku;
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
    this.generatorService.isAddingToCart = true;
    const productSize = this.generatorService.size === 'Small' ? ProductSize.SMALL : this.generatorService.size === 'Medium' ? ProductSize.MEDIUM : ProductSize.LARGE;
    const productOrientation = this.generatorService.orientation === 'Portrait' ? ProductOrientation.PORTRAIT : ProductOrientation.LANDSCAPE;
    console.log(this.generatorService.size);
    console.log(this.generatorService.orientation);
    if (this.generatorService.generatorType === 'map-poster') {
      this.createPrintMap().then(
        (dataUrl) => {
          this.posterSrcHidden = dataUrl;
          setTimeout(() => {
            this.captureImage().then((png) => this.cartService.addToCart(this.productSku, 1, png, productSize, productOrientation, this.generatorService.fuseType, this.generatorService.overlayColor, this.generatorService.backgroundColor, this.generatorService.overlayTitle, this.generatorService.overlaySubtitle, this.generatorService.overlayTag, this.generatorService.displayOverlay));
          }, 50); // timeout so the dom element can populate correctly
        }
      );
    } else {
      this.captureImage().then((png) => this.cartService.addToCart(this.productSku, 1, png, productSize, productOrientation, this.generatorService.fuseType, this.generatorService.overlayColor, this.generatorService.backgroundColor, this.generatorService.overlayTitle, this.generatorService.overlaySubtitle, this.generatorService.overlayTag, this.generatorService.displayOverlay));
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

  captureImage(): Promise<string> {
    return new Promise((resolve) => {
      const node = this.generatorService.generatorType === 'fusion-poster' ? this.elRef.nativeElement.querySelector('#fuzeit') : this.elRef.nativeElement.querySelector('#poster');

      domtoimage.toPng(node)
        .then((png) => {
          // saveAs(blob, 'Student-Talks-poster.png'); -- Must be 'toBLob' not 'toPng
          resolve(png);
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
    });
  }
}
