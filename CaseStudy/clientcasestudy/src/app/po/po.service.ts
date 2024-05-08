import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from '@app/generic-http.service';
import { Po } from '@app/po/po';
@Injectable({
  providedIn: 'root',
})
export class PoService extends GenericHttpService<Po> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `pos`);
  }
}
