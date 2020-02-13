import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerService } from './customer.service';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class UtilService {

  scrollDirection: 'up' | 'down' = 'up';
  checkScrollInfinite = false;
  allFetched = false;
  displayExploreNav = false;

  private infiniteActiveSubject: BehaviorSubject<void>;
  public infiniteActive$: Observable<void>;
  public infiniteActive: boolean;

  constructor(
    private httpClient: HttpClient,
    private customerService: CustomerService
  ) {
    this.infiniteActiveSubject = new BehaviorSubject(null);
    this.infiniteActive$ = this.infiniteActiveSubject.asObservable();
    this.infiniteActive = false;
  }

  getJSON(path: string) {
    return this.httpClient.get(path).pipe(map((res: any) => res.json()));
  }

  convertImageToDataURL(url: string): Promise<any> {
    return fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));
  }

  toPixels(length: number): string {
    const conversionFactor = 96;
    return conversionFactor * length + 'px';
  }

  displayPrice(product) {
    if (product) {
      return product.productPricesByProductSku.nodes.filter((price) => price.currency === this.customerService.currency)[0].amount / 100;
    }
    return null;
  }
}
