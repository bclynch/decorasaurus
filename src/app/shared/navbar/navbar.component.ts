import { Component, Input, OnDestroy } from '@angular/core';

import { UtilService } from '../../services/util.service';
import { RouterService } from '../../services/router.service';
import { MobileNavDialogueComponent } from '../mobile-nav-dialogue/mobile-nav-dialogue.component';
import { CartService } from 'src/app/services/cart.service';
import { SubscriptionLike } from 'rxjs';
import { MatDialog } from '@angular/material';
import { CustomerService } from 'src/app/services/customer.service';

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
export class NavbarComponent implements OnDestroy {
  @Input() collapsibleNav: boolean;

  cartSubscription: SubscriptionLike;
  dialogueSubscription: SubscriptionLike;

  cartNumber: number;

  private _dismiss: any;
  sectionOptions: Section[] = [
    {
      label: 'Create',
      value: 'create',
      subSections: [
        {
          label: 'Remix Posters',
          value: 'remix',
          path: 'create/poster-generator/remix-poster'
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
    private cartService: CartService,
    public dialog: MatDialog,
    private customerService: CustomerService
  ) {
    this.cartSubscription = this.cartService.cartItems.subscribe(
      (items) => {
        if (items) {
          let cart = 0;
          items.data.forEach((item) => cart += item.quantity);
          this.cartNumber = cart;
        }
      }
    );
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
    if (this.dialogueSubscription) this.dialogueSubscription.unsubscribe();
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

  openMobileNav() {
    const dialogRef = this.dialog.open(MobileNavDialogueComponent, {
      panelClass: 'mobiledialog-panel'
    });

    this.dialogueSubscription = dialogRef.afterClosed().subscribe(result => {

      if (result) {
        switch (result) {
          case 'About':
            this.routerService.navigateToPage('/about');
            break;
          case 'Custom Remix Posters':
            this.routerService.navigateToPage('/create/poster-generator/remix-poster');
            break;
          case 'City Map Posters':
            this.routerService.navigateToPage('/create/poster-generator/map-poster');
            break;
          case 'Patent Posters':
            this.routerService.navigateToPage('/create/poster-generator/patent-poster');
            break;
        }
      }
    });
  }

  goToAccount() {
    // if logged in go to accont page otherwise pop open login dialogue
    if (this.customerService.customerToken.getValue()) {
      this.routerService.navigateToPage('/account');
    } else {
      this.customerService.signin('login', 'account');
    }
  }
}
