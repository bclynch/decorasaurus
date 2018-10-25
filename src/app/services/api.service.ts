import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ENV } from '../../environments/environment';

import { Apollo } from 'apollo-angular';

@Injectable()
export class APIService {

  constructor(
    private http: Http,
    private apollo: Apollo
  ) {}

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
}
