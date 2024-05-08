import { Injectable } from '@angular/core';
import { Product } from '@app/product/product';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from '@app/generic-http.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends GenericHttpService<Product> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `products`);
  } // constructor
}
