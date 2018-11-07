import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ENV } from '../../environments/environment';

import { Apollo } from 'apollo-angular';
// import { HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable()
export class APIService {

  constructor(
    private http: Http,
    private httpClient: HttpClient,
    private apollo: Apollo
  ) {}

  // Create Customer
  createCustomer(name: string, email: string, password: string) {
    return this.http.post(`${ENV.apiBaseURL}/moltin/create-customer`, { name, email, password })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          console.log(error);
          return throwError('Something went wrong');
        }
    ));
  }

  // Login Customer
  loginCustomer(email: string, password: string) {
    return this.http.post(`${ENV.apiBaseURL}/moltin/login-customer`, { email, password })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          console.log(error);
          return throwError('Something went wrong');
        }
    ));
  }

  // Posterize Uploads
  posterizeImage(formData: FormData) {
    return this.http.post(`${ENV.apiBaseURL}/posterize`, formData)
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  // patent endpoints
  fetchPatent(patentNumber: string) {
    return this.http.post(`${ENV.apiBaseURL}/patent/fetch`, { patent: patentNumber })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  tracePatent(url: string, color: string) {
    return this.http.post(`${ENV.apiBaseURL}/patent/trace`, { patent: url, color })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  // Stripe routes
  createStripeCustomer(email: string, token: string) {
    return this.http.post(`${ENV.apiBaseURL}/stripe/create-customer`, { email, token })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  fetchStripeCustomer(email: string) {
    return this.http.post(`${ENV.apiBaseURL}/stripe/fetch-customer`, { email })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  deleteCard(customerId: string, cardId: string) {
    return this.http.post(`${ENV.apiBaseURL}/stripe/delete-card`, { customerId, cardId })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  changeDefaultCard(customerId: string, sourceId: string) {
    return this.http.post(`${ENV.apiBaseURL}/stripe/change-default-card`, { customerId, sourceId })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  processPoster(formData: FormData) {
    return this.http.post(`${ENV.apiBaseURL}/poster/process`, formData)
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  searchPhotos(query: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': ENV.pexelsKey
      })
    };
    return this.httpClient.get(`https://api.pexels.com/v1/search?query=${query}&per_page=30&page=1`, httpOptions)
    .pipe(map((response: any) => response.photos))
    .pipe(catchError(
        (error: Response) => {
          console.log(error);
          return Observable.throw('Something went wrong');
        }
    ));
  }
}
