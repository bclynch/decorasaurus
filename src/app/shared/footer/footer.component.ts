import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { RouterService } from '../../services/router.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  year = Date.now();

  links: string[] = ['About', 'Contact', 'Terms', 'Privacy Policy'];
  socialOptions = [
    { icon: 'favorite', url: 'https://www.instagram.com/bclynch7/', label: 'instagram' },
    { icon: 'favorite', url: 'https://www.facebook.com/brendan.lynch.90', label: 'facebook' },
    { icon: 'favorite', url: 'https://github.com/bclynch', label: 'github' },
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private routerService: RouterService
  ) { }

  navigateTo(link) {
    switch (link) {
      case 'About':
        this.router.navigateByUrl('/about');
        break;
      case 'Contact':
        this.router.navigateByUrl('/contact');
        break;
      case 'Terms':
        this.router.navigateByUrl('/terms');
        break;
      case 'Privacy Policy':
        this.routerService.modifyFragment('privacy', '/terms');
        break;
    }
  }
}
