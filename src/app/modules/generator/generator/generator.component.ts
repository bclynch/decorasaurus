import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Moltin } from '../../../providers/moltin/moltin';
import { CartService } from 'src/app/services/cart.service';
import { SubscriptionLike } from 'rxjs';
import * as domtoimage from 'dom-to-image';
import { GeneratorService } from 'src/app/services/generator.service';
import { SafeUrl } from '@angular/platform-browser';
// import { saveAs } from 'file-saver';


@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})

export class GeneratorComponent implements OnInit, OnDestroy {

  paramsSubscription: SubscriptionLike;
  productSubscription: SubscriptionLike;
  tracingSubscription: SubscriptionLike;
  posterSourceSubscription: SubscriptionLike;

  tracing: boolean;
  productId: string;
  posterSrc: string | SafeUrl;
  posterSrcHidden: string | SafeUrl;

  constructor(
    private route: ActivatedRoute,
    private moltin: Moltin,
    private cartService: CartService,
    private elRef: ElementRef,
    private generatorService: GeneratorService
  ) {
    this.paramsSubscription = this.route.params.subscribe((params) => {
      this.generatorService.generatorType = params.type;

      // identify product id
      switch (this.generatorService.generatorType) {
        case 'remix-poster':
          this.productId = '43a8b3fb-9da1-40f8-b02b-b508cb633006';
          break;
        case 'patent-poster':
          this.productId = '19d80aa5-df4a-441b-939c-165957700240';
          // reset orientation in case they switched from a landscape remix or something
          this.generatorService.orientation = 'Portrait';
          break;
        case 'map-poster':
          this.productId = 'c9d1a039-ed04-444d-a248-e213fca3acc0';
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

    // resetting this so it doesn't mess with formatting of poster on path change
    this.generatorService.remixType = null;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.productSubscription.unsubscribe();
    this.tracingSubscription.unsubscribe();
    this.posterSourceSubscription.unsubscribe();
  }

  addToCart() {
    const node = this.elRef.nativeElement.querySelector('#poster');

    domtoimage.toPng(node)
      .then((png) => {
        // saveAs(blob, 'Student-Talks-poster.png'); -- Must be 'toBLob' not 'toPng
        this.cartService.addCustomToCart(this.generatorService.product, png, this.generatorService.backgroundColor);
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }
}
