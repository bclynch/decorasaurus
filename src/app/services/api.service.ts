import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ENV } from '../../environments/environment';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class APIService {

  constructor(
    private httpClient: HttpClient,
    private apollo: Apollo
  ) {}

  genericCall(mutation: string) {
    return this.apollo.mutate({
      mutation: gql`${mutation}`
    });
  }

  // Email endpoints
  sendResetEmail(user: string, pw: string) {
    return this.httpClient.post(`${ENV.apiBaseURL}/mailing/reset`, { user, pw })
      .pipe(map(
        response => (response)
      )).pipe(catchError(
        (error: HttpErrorResponse) => throwError(error.message || 'server error.')
    ));
  }

  sendContactEmail(data: { why: string; name: string; email: string; content: string; }) {
    return this.httpClient.post(`${ENV.apiBaseURL}/mailing/contact`, { data })
      .pipe(map(
        response => (response)
      )).pipe(catchError(
        (error: HttpErrorResponse) => throwError(error.message || 'server error.')
      ));
  }

  // Posterize Uploads
  posterizeImage(formData: FormData) {
    return this.httpClient.post(`${ENV.apiBaseURL}/posterize`, formData)
    .pipe(map(
      response => (response)
    )).pipe(catchError(
      (error: HttpErrorResponse) => throwError(error.message || 'server error.')
    ));
  }

  // patent endpoints
  fetchPatent(patentNumber: string) {
    return this.httpClient.post(`${ENV.apiBaseURL}/patent/fetch`, { patent: patentNumber })
    .pipe(map(
      response => (response)
      )
    ).pipe(catchError(
      (error: HttpErrorResponse) => throwError(error.message || 'server error.')
    ));
  }

  tracePatent(url: string, color: string) {
    return this.httpClient.post(`${ENV.apiBaseURL}/patent/trace`, { patent: url, color })
    .pipe(map(
      response => (response)
    )).pipe(catchError(
      (error: HttpErrorResponse) => throwError(error.message || 'server error.')
    ));
  }

  // *******************************************************************
  // ************************* Stripe Routes *********************************
  // *******************************************************************
  createStripeCustomer(email: string, token: string) {
    return this.httpClient.post(`${ENV.apiBaseURL}/stripe/create-customer`, { email, token })
    .pipe(map(
      response => (response)
    )).pipe(catchError(
      (error: HttpErrorResponse) => throwError(error.message || 'server error.')
    ));
  }

  fetchStripeCustomer(email: string) {
    return this.httpClient.post(`${ENV.apiBaseURL}/stripe/fetch-customer`, { email })
    .pipe(map(
      response => (response)
    )).pipe(catchError(
      (error: HttpErrorResponse) => throwError(error.message || 'server error.')
    ));
  }

  deleteCard(customerId: string, cardId: string) {
    return this.httpClient.post(`${ENV.apiBaseURL}/stripe/delete-card`, { customerId, cardId })
    .pipe(map(
      response => (response)
    )).pipe(catchError(
      (error: HttpErrorResponse) => throwError(error.message || 'server error.')
    ));
  }

  changeDefaultCard(customerId: string, sourceId: string) {
    return this.httpClient.post(`${ENV.apiBaseURL}/stripe/change-default-card`, { customerId, sourceId })
    .pipe(map(
      response => (response)
    )).pipe(catchError(
      (error: HttpErrorResponse) => throwError(error.message || 'server error.')
    ));
  }

  processPoster(formData: FormData) {
    return this.httpClient.post(`${ENV.apiBaseURL}/poster/process`, formData)
    .pipe(map(
      response => (response)
    )).pipe(catchError(
      (error: HttpErrorResponse) => throwError(error.message || 'server error.')
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
      (error: HttpErrorResponse) => throwError(error.message || 'server error.')
    ));
  }
}
