import { Component, Input, OnDestroy } from '@angular/core';
import { RouterService } from '../../services/router.service';
import { MobileNavDialogueComponent } from '../mobile-nav-dialogue/mobile-nav-dialogue.component';
import { CartService } from 'src/app/services/cart.service';
import { SubscriptionLike } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
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
          label: 'Fusion Posters',
          value: 'fusion',
          path: 'create/poster-generator/fusion-poster'
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
        },
        {
          label: 'Trace Posters',
          value: 'trace',
          path: 'create/poster-generator/trace-poster'
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
          path: 'faqs'
        },
        {
          label: 'Contact',
          value: 'contact',
          path: 'contact'
        }
      ]
    }
  ];
  isExpanded = false; // set to true for testing
  activeSection: Section;

  searchActive = false;

  regions;

  constructor(
    public routerService: RouterService,
    private cartService: CartService,
    public dialog: MatDialog,
    private customerService: CustomerService
  ) {
    this.cartSubscription = this.cartService.cartItems.subscribe(
      (items: any) => {
        if (items) this.cartNumber = items.cartItemsByCartId.nodes.length ? items.cartItemsByCartId.nodes.map((item) => item.quantity).reduce((x, y) => x + y) : 0;
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

      console.log(result);
      if (result) {
        switch (result) {
          case 'About':
            this.routerService.navigateToPage('/about');
            break;
          case 'Custom Fusion Posters':
            this.routerService.navigateToPage('/create/poster-generator/fusion-poster');
            break;
          case 'City Map Posters':
            this.routerService.navigateToPage('/create/poster-generator/map-poster');
            break;
          case 'Patent Posters':
            this.routerService.navigateToPage('/create/poster-generator/patent-poster');
            break;
          case 'Custom Trace Posters':
            this.routerService.navigateToPage('/create/poster-generator/trace-poster');
            break;
          case 'FAQs':
            this.routerService.modifyFragment('faqs', '/help');
            break;
          case 'Contact':
            this.routerService.modifyFragment('contact', '/help');
            break;
        }
      }
    });
  }

  navigate(path) {
    if (path === 'faqs' || path === 'contact') {
      this.routerService.modifyFragment(path, '/help');
    } else {
      this.routerService.navigateToPage(path);
    }
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
