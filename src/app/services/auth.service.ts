import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import { tap } from 'rxjs/operators';
import {Router, CanActivate } from '@angular/router';

export interface User {
  heroesUrl: string;
  textfile: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  constructor(private http: HttpClient, private router: Router) {
    }

   private setSession(authResult) {
        const expiresAt = moment().add(authResult.expiresIn, 'second');

        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()) );
    }

    logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
    }

    public isLogged() {
        if (!localStorage.getItem('user')) {
          this.router.navigate(['/login']);
        } else {
          return false;
        }
    }

    public isLoggedIn() {
      if (!localStorage.getItem('user')) {
        return false;
      } else {
        return true;
      }
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem('expires_at');
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }
    canActivate() {
      var
        identity:any = localStorage.getItem('user'),
        splice: any = [];
      // console.log(identity, window.location.pathname);
      splice = _.split(window.location.pathname, "/", 3);
      // console.log(splice);
      if(splice[1] === 'admin' || identity){
        if (identity) {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }
    }
    urlreturn(splice, identity){
      if(splice){
        if (identity) {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }
    }
}
