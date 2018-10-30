import { Component, Input } from '@angular/core';

import { UtilService } from '../../services/util.service';
import { RouterService } from '../../services/router.service';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';
import { CartService } from 'src/app/services/cart.service';

interface Section {
  label: string;
  value: string;
  subSections: {
    label: string;
    value: string;
    path: string;
  }[];
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() collapsibleNav: boolean;

  cartNumber: number;

  private _dismiss: any;
  sectionOptions: Section[] = [
    {
      label: 'Create',
      value: 'create',
      subSections: [
        {
          label: 'Stylized Posters',
          value: 'stylized',
          path: 'create/poster-generator/stylized-poster'
        },
        {
          label: 'City Map Posters',
          value: 'map',
          path: 'create/poster-generator/map-poster'
        },
        {
          label: 'Patent Posters',
          value: 'patent',
          path: 'create/poster-generator/patent-poster'
        }
      ]
    },
    {
      label: 'About',
      value: 'about',
      subSections: []
    },
    {
      label: 'Help',
      value: 'help',
      subSections: [
        {
          label: 'FAQs',
          value: 'faqs',
          path: 'create/poster-generator/faqs'
        },
        {
          label: 'Contact',
          value: 'contact',
          path: 'create/poster-generator/contact'
        }
      ]
    }
  ];
  isExpanded = false; // set to true for testing
  activeSection: Section;

  searchActive = false;

  regions;

  constructor(
    private utilService: UtilService,
    private routerService: RouterService,
    private cartService: CartService
  ) {
    this.cartService.cartItems.subscribe(
      (items) => {
        console.log(items);
        if (items) {
          let cart = 0;
          items.data.forEach((item) => cart += item.quantity);
          this.cartNumber = cart;
        }
      }
    );
  }

  navHover(e, i: number) {
    if (e.type === 'mouseenter') {
      this.isExpanded = true;
      this.activeSection = this.sectionOptions[i];
    } else {
      this.isExpanded = false;
      this.activeSection = null;
    }
  }

  // async openMobileNav() {
  //   const modal = await this.modalCtrl.create({
  //     component: MobileNavComponent,
  //     cssClass: 'mobileNavModal',
  //     // animated: false,
  //     backdropDismiss: false
  //   });
  //   await modal.present();

  //   this._dismiss = await modal.onDidDismiss();


  //   console.log('Dismissed modal', this._dismiss);
  //   if (this._dismiss.data) {
  //     switch (this._dismiss.data) {
  //       case 'About':
  //         this.routerService.navigateToPage('/about');
  //         break;
  //       case 'Custom Stylized Posters':
  //         this.routerService.navigateToPage('/create/poster-generator/stylized-poster');
  //         break;
  //       case 'City Map Posters':
  //         this.routerService.navigateToPage('/create/poster-generator/map-poster');
  //         break;
  //       case 'Patent Posters':
  //         this.routerService.navigateToPage('/create/poster-generator/patent-poster');
  //         break;
  //     }
  //   }
  // }
}
