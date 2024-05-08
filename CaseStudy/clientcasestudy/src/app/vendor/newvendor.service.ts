import { Injectable } from '@angular/core';
import { Vendor } from './vendor';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from '@app/generic-http.service';

@Injectable({
  providedIn: 'root',
})
export class NewVendorService extends GenericHttpService<Vendor> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `vendors`);
  } // constructor
}
