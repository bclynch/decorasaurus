import { Injectable } from '@angular/core';
import { AllAddressesByCustomerGQL, CreateAddressGQL, AddressType } from '../generated/graphql';
import { map } from 'rxjs/operators';

@Injectable()
export class AddressService {

  constructor(
    private allAddressesByCustomerGQL: AllAddressesByCustomerGQL,
    private createAddressGQL: CreateAddressGQL
  ) {

  }

  getAddressesByCustomer(customerId: string): Promise<any> {
    return new Promise((resolve) => {
      this.allAddressesByCustomerGQL.fetch({ customerId })
        .pipe(
          map(result => resolve(result.data.allAddresses.nodes))
        );
    });
  }

  createAddress(customerId: string, type: AddressType, name: string, firstName: string, lastName: string, company: string, line1: string, line2: string, city: string, postcode: string, country: string, instructions: string, defaultAddress: boolean) {
    return new Promise((resolve) => {
      this.createAddressGQL.mutate({ customerId, type, name, firstName, lastName, company, line1, line2, city, postcode, country, instructions, defaultAddress })
        .subscribe(
          (result) => resolve(result.data.createAddress.address.id)
        );
    });
  }
}

