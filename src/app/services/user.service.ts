import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
import { retryWhen, delayWhen, catchError, tap } from 'rxjs/operators';
import { timer } from 'rxjs';
import { handleError } from './errores';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url: string;
  private handleError: any;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
 }
  login(user: Object) {
    return this._http.post(this.url + 'user/login', user);
  }
  register(user: Object) {
    return this._http.post(this.url + 'user/register', user);
  }
}
