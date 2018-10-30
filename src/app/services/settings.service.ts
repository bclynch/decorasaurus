import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';
import { CartService } from './cart.service';
import { BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public appInited: Observable<any>;
  private _subject: BehaviorSubject<any>;

  constructor(
    private cookieService: CookieService,
    private userService: UserService,
    private cartService: CartService
  ) {
    this._subject = new BehaviorSubject<boolean>(false);
    this.appInited = this._subject;
  }

  appInit() {
    // create uuid and put in cookie if doesn't exist or ref the existing one
    const cookieUuid = this.cookieService.get('user');
    if (cookieUuid) {
      this.userService.userUuid = cookieUuid;
    } else {
      const userUuid = uuid();
      this.cookieService.set( 'user', userUuid );
      this.userService.userUuid = userUuid;
    }

    this.cartService.getCart().then(() => this._subject.next(true));
  }
}
