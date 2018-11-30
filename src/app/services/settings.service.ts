import { Injectable } from '@angular/core';
import { CustomerService } from './customer.service';
import { CartService } from './cart.service';
import { BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public appInited: Observable<any>;
  private _subject: BehaviorSubject<any>;

  constructor(
    private customerService: CustomerService,
    private cartService: CartService
  ) {
    this._subject = new BehaviorSubject<boolean>(false);
    this.appInited = this._subject;
  }

  appInit() {
    this.customerService.fetchUser().then(
      () => this.cartService.getCart().then(() => this._subject.next(true))
    );
  }
}
