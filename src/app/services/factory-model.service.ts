import { Injectable } from '@angular/core';
import { Config } from './Config';
import { HttpClient } from '@angular/common/http';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { handleError } from './errores';

@Injectable({
  providedIn: 'root'
})
export class FactoryModelService {
  private url: string;
  private handleError: any;
  public user: any;
  public niveles: any;
  public global: any;

  constructor(
    private _http: HttpClient
  ) {
      this.url = GLOBAL.url;
      this.global = GLOBAL;
      this.handleError = handleError;
  }
  loadUser() {
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user);
    if (this.user) {
      this.query('usernivel', {user: this.user.id})
      .subscribe(
        (response: any) => {
          if (response.data.length) {
            console.log('tiene nivel asignado');
            console.log(response.data[0]);
            this.user.titleNivel = response.data[0].nivel.title;
            this.user.nivel = response.data[0];
          } else {
            this.cargarNiveles();
          }
        },
        (error: any) => {
          return false;
        }
       );
    }
  }
  private cargarNiveles(): any {
    this.get('nivel', {})
    .subscribe(
      (response: any) => {
        console.log('niveles');
        console.log(response);
        this.niveles = response;
        this.asignarNivel();
      },
      (error: any) => {
        console.log(error);
        return false;
      }
    );
  }
  private asignarNivel(): any {
    this.create('usernivel', {user: this.user.id, nivel: this.niveles[0].id}).subscribe(
      (response: any) => {
        console.log('nivel asignado ');
        console.log(response);
        this.user.titleNivel = this.niveles[0].title;
        return this.user.nivel = response;
      },
      (error: any) => {
        console.log(error);
        return false;
      }
    );
  }

  create(modelo: string, query: any): Observable<Config> {
    return this._http.post<Config>(this.url + modelo, query).pipe(
      // retry(3),
      catchError(this.handleError)
    );
  }
  update(modelo: string, referencia: string, query: any): Observable<Config> {
    return this._http.put<Config>(this.url + modelo + '/' + referencia, query).pipe(
      // retry(3),
      catchError(this.handleError)
    );
  }
  delete(modelo: string, referencia: string, query: any) {
    return this._http.delete(this.url + modelo + '/' + referencia, query).pipe(
      // retry(3),
      catchError(this.handleError)
    );
  }
  get(modelo: string, query: any) {
    if (query) {
      const options = {
        params: query
      };
      return this._http.get(this.url + modelo, options).pipe(
        // retry(3),
        catchError(this.handleError)
      );
    } else {
      return this._http.get(this.url + modelo).pipe(
        // retry(3),
        catchError(this.handleError)
      );
    }
  }
  query(modelo: string, query: any) {
    if (query) {
      const options = {
        params: query
      };
      return this._http.post(this.url + modelo + '/query', options).pipe(
        // retry(3),
        catchError(this.handleError)
      );
    } else {
      return this._http.get(this.url + modelo).pipe(
        // retry(3),
        catchError(this.handleError)
      );
    }
  }
  getFechaServidor() {
    return this._http.get(this.url + 'user/fecha').pipe(
      // retry(3),
      catchError(this.handleError)
    );
  }
}
