import { Component } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './services/user.service';
import { Moltin } from './providers/moltin/moltin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'decorasaurus';

  constructor(
    private cookieService: CookieService,
    private userService: UserService,
    private moltin: Moltin
  ) {
    this.setupUser();
  }

  setupUser() {
    // create uuid and put in cookie if doesn't exist or ref the existing one
    const cookieUuid = this.cookieService.get('user');
    if (cookieUuid) {
      this.userService.userUuid = cookieUuid;
    } else {
      const userUuid = uuid();
      this.cookieService.set( 'user', userUuid );
      this.userService.userUuid = userUuid;
    }

    this.moltin.getCart(this.userService.userUuid).subscribe(
      (data => {
        console.log(data);
      })
    );
  }
}
