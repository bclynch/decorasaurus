import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { AddressType } from '../api/mutations/address.mutation';

@Injectable()
export class AddressService {

  constructor(
    private apiService: APIService
  ) {

  }

  getAddressesByCustomer(customerId: string): Promise<any> {
    return new Promise((resolve) => {
      this.apiService.getAddressesByCustomer(customerId).valueChanges.subscribe(
        ({ data }) => {
          console.log(data.allAddresses.nodes);
          resolve(data.allAddresses.nodes);
        }
      );
    });
  }

  createAddress(customerId: string, type: AddressType, name: string, firstName: string, lastName: string, company: string, line1: string, line2: string, city: string, postcode: string, country: string, instructions: string, defaultAddress: boolean) {
    return new Promise((resolve) => {
      this.apiService.createAddress(customerId, type, name, firstName, lastName, company, line1, line2, city, postcode, country, instructions, defaultAddress).subscribe(
        ({ data }) => resolve(data.createAddress.address.id)
      );
    });
  }
}

