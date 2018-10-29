import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoltinProduct } from '../../../providers/moltin/models/product';
import { Moltin } from '../../../providers/moltin/moltin';
import { DomSanitizer } from '@angular/platform-browser';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})

export class GeneratorComponent implements OnInit {

  generatorType;
  productId: string;
  product: MoltinProduct;

  // // poster props
  background = 'white';
  tracing = false;
  posterWidth = 12; // inches
  posterHeight = 18; // inches

  // patent props
  posterSVG = null;

  constructor(
    private route: ActivatedRoute,
    private moltin: Moltin,
    private _DomSanitizationService: DomSanitizer,
    private cartService: CartService
  ) {
    this.route.params.subscribe((params) => {
      this.generatorType = params.type;

      // identify product id
      switch (this.generatorType) {
        case 'stylized-poster':
          this.productId = '43a8b3fb-9da1-40f8-b02b-b508cb633006';
          break;
        case 'patent-poster':
          this.productId = '19d80aa5-df4a-441b-939c-165957700240';
          break;
        case 'map-poster':
          this.productId = 'c9d1a039-ed04-444d-a248-e213fca3acc0';
          break;
      }

      // fetch product info
      this.moltin.getProductById(this.productId).subscribe(product => {
        // console.log(product);
        this.product = product;
      });
    });
  }

  ngOnInit() {
  }

  cleanSVG(svg: string) {
    if (svg) {
      this.posterSVG = this._DomSanitizationService.bypassSecurityTrustUrl(svg);
    } else {
      this.posterSVG = null;
    }
  }
}
