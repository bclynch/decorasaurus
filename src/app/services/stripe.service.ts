import { Injectable, Component, Inject } from '@angular/core';
import { ENV } from '../../environments/environment';
import { APIService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CustomerService } from './customer.service';

declare const Stripe: any;

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  stripe = Stripe(ENV.stripeKey);
  sources;
  stripeCustomer;
  selectedCard;
  cardIsSelected: BehaviorSubject<boolean>;
  get isCardSelected() {
    return this.cardIsSelected.asObservable();
  }

  cardImages = {
    'Visa': 'https://js.stripe.com/v3/fingerprinted/img/visa-d6c6e0a636f7373e06d5fb896ad49475.svg',
    'MasterCard': 'https://js.stripe.com/v3/fingerprinted/img/mastercard-a96ee3841a5e1e28d05ed3f0f4da62b8.svg',
    'American Express': 'https://js.stripe.com/v3/fingerprinted/img/amex-edf6011de255d8a4c22904795c9d8770.svg',
    'Discover': 'https://js.stripe.com/v3/fingerprinted/img/discover-8f3d8fc6ef836da1fcac12c095ee6fb8.svg',
    'Diners Club': 'https://js.stripe.com/v3/fingerprinted/img/diners-fced9e136fd8c25f40a3e7b37a51dc1d.svg',
    'JCB': 'https://js.stripe.com/v3/fingerprinted/img/jcb-1b12d588a1e9465d4d9fb84a610f9136.svg'
  };

  constructor(
    private apiService: APIService,
    public snackBar: MatSnackBar,
    private customerService: CustomerService
  ) {
    this.cardIsSelected = new BehaviorSubject<boolean>(false);
  }

  createCardElement() {
    return this.stripe.elements().create('card', {
      hidePostalCode: true
    });
  }

  checkCustomerState(token: string): Promise<string> {
    // checks to see if the customer has a Stripe ID or not
    return new Promise((resolve, reject) => {
      if (this.customerService.customerObject.stripeId) {
        resolve(this.customerService.customerObject.stripeId);
        return;
      }

      this.createStripeCustomer(this.customerService.customerObject.email, token).subscribe(
        ({ data }: any) => {
          console.log(data);
          // update customer object
          this.customerService.updateCustomer(this.customerService.customerObject.id, this.customerService.customerObject.firstName, this.customerService.customerObject.lastName, data.id).then(
            () => resolve()
          );
        }
      );
    });
  }

  private createStripeCustomer(email: string, token: string) {
    return this.apiService.createStripeCustomer(email, token);
  }

  fetchStripeCustomer(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.fetchStripeCustomer(email).subscribe(
        ({ data }: any) => {
          if (data.data.length) {
            this.stripeCustomer = data.data[0];
            console.log(this.stripeCustomer);

            // check if there are already sources and populate
            this.sources = this.stripeCustomer.sources.data;
            if (this.stripeCustomer.default_source) {
              this.cardFromDefault(this.stripeCustomer.default_source);
              this.cardIsSelected.next(true);
            }

            // populate stripeId on customer if required
            if (!this.customerService.customerObject.stripeId) {
              this.customerService.updateCustomer(this.customerService.customerObject.id, this.customerService.customerObject.firstName, this.customerService.customerObject.lastName, this.stripeCustomer.id).then(
                () => resolve()
              );
            } else {
              resolve();
            }
          }
        },
        (err) => console.log(err),
      );
    });
  }

  createPaymentSource(card): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stripe.createToken(card).then(
        (resp) => {
          if (resp.error) {
            this.snackBar.openFromComponent(AddedSnackbar, {
              duration: 3000,
              verticalPosition: 'top',
              data: { message: resp.error.message },
              panelClass: ['snackbar-theme']
            });
          }
          if (resp.token) {
            console.log(resp);
            this.selectedCard = resp.token.card;
            this.stripeCustomer = resp.token;
            this.cardIsSelected.next(true);
            this.snackBar.openFromComponent(AddedSnackbar, {
              duration: 3000,
              verticalPosition: 'top',
              data: { message: 'Card successfully Added' },
              panelClass: ['snackbar-theme']
            });
          }
          resolve();
        },
        (err) => {
          console.log(err);
          this.snackBar.openFromComponent(AddedSnackbar, {
            duration: 3000,
            verticalPosition: 'top',
            data: { message: 'Something went wrong. Check your payment credentials and try again.' },
            panelClass: ['snackbar-theme']
          });
          reject();
        }
      );
    });
  }

  private cardFromDefault(defaultSource: string) {
    for (let i = 0; i < this.sources.length; i++) {
      if (this.sources[i].id === defaultSource) {
        this.selectedCard = this.sources[i];
        this.cardIsSelected.next(true);
        return;
      }
    }
  }

  deleteCard(card) {
    this.apiService.deleteCard(card.customer, card.id).subscribe(
      ({ data }: any) => {
        console.log(data);
        if (data && data.deleted) {
          this.sources = this.sources.filter((source) => source.id !== data.id);
          this.snackBar.openFromComponent(AddedSnackbar, {
            duration: 3000,
            verticalPosition: 'top',
            data: { message: 'Card successfully deleted' },
            panelClass: ['snackbar-theme']
          });
        }
      },
      (err) => console.log(err),
    );
  }

  changeDefaultCard(card) {
    this.apiService.changeDefaultCard(card.customer, card.id).subscribe(
      ({ data }: any) => {
        console.log(data);
        this.stripeCustomer = data;
        this.snackBar.openFromComponent(AddedSnackbar, {
          duration: 3000,
          verticalPosition: 'top',
          data: { message: 'Default card updated' },
          panelClass: ['snackbar-theme']
        });
      },
      (err) => console.log(err),
    );
  }
}

@Component({
  selector: 'app-remove-snackbar',
  template: `
    <div>
      "{{data.message}}"
    </div>
  `
})
export class AddedSnackbar {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {

  }
}
