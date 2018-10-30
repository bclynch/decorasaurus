import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { APIService } from './api.service';

declare let ga: Function;

@Injectable()
export class AnalyticsService {

  subscription: Subscription;

  constructor(
    private router: Router,
    private apiService: APIService
  ) {

  }

  trackViews() {
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }

  destroyTracking() {
    this.subscription.unsubscribe();
  }
}
