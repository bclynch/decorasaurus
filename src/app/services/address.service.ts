import { Injectable } from '@angular/core';
import { APIService } from './api.service';

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
          resolve([]);
        }
      );
    });
  }
}

