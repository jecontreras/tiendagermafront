import { Injectable } from '@angular/core';
import { Config } from './Config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { handleError } from './errores';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { App } from './../models/app';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class FactoryModelService {
  public url: string;
  private handleError: any;
  public user: any;
  public niveles: any;
  public global: any;
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  public app: Object={};
  constructor(
    private _http: HttpClient,
    private router: Router,
    private _auth: AuthService,
  ) {
      this.url = GLOBAL.url;
      this.global = GLOBAL;
      this.handleError = handleError;
      this.app = {
        app: 'Venty',
        logo: 'https://publihazclick.s3.amazonaws.com/venty/dba933cc-1b94-464e-8317-8fdd32bcef0d.png',
        descripcion: 'tienda onlain',
        nit: '101232222121',
        direccion: 'calle 1',
        telefono: '312221211',
        email: 'admin@gmail.com',
        portada1: './assets/img/productnew2.png',
        portada2: './assets/img/tecnologia.jpg',
        portada3: './assets/img/computadores.png',
        portada4: './assets/img/gamer.jpg',
        portada5: './assets/img/descuentos.png',
        politicas: 'si',
        apoyo1: './assets/img/apoyo/dell.png',
        apoyo2: './assets/img/apoyo/hp.png',
        apoyo3: './assets/img/apoyo/intel.png',
        apoyo4: './assets/img/apoyo/lenovo.png',
        apoyo5: './assets/img/apoyo/motorola.png',
        apoyo6: './assets/img/apoyo/samsung.png',
      };
  }
  loadapp(){
    if(JSON.parse(localStorage.getItem('app'))){
      this.app = JSON.parse(localStorage.getItem('app'));
    }
    return this.query('app', {
      where:{
        app: 'Venty'
      }
    })
    .subscribe(
      (res:any)=>{
         //console.log(res);
        res = res.data[0];
        if(res){
          localStorage.removeItem('app');
          localStorage.setItem('app', JSON.stringify(res));
          this.app = res;
        }
      }
    );
  }
  loadUser() {
    this.user = JSON.parse(localStorage.getItem('user'));
    // console.log(this.user);
    if (this._auth.canActivate()) {
      this.query('user', {
          where:{
            id: this.user.id
          }
      })
        .subscribe(
          (response: any) => {
            // console.log(response);
            response = response.data[0];
            if (response) {
              // localStorage.clear();
              if(response.empresa){
                response.objempresa = response.empresa;
                response.empresa = response.empresa.id;
              }
              localStorage.removeItem('user');
              localStorage.setItem('user', JSON.stringify(response));
              this.user = JSON.parse(localStorage.getItem('user'));
            } else {
              // localStorage.clear();
              localStorage.removeItem('user');
              this.router.navigate(['login']);
            }
          },
          (error: any) => {
            console.log(error);
            this._auth.canActivate();
            // localStorage.clear();
            localStorage.removeItem('user');
            this.router.navigate(['login']);
          }
        );
    }
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
    if (!query) {
      query = {};
    }
    if (!query.where) {
      query = {
        where: query
      }
        ;
    }
    const ruta = _.split(modelo, '/', 2);
    if (ruta[1]) {
      modelo = modelo;
    } else {
      modelo = modelo + '/query';
    }

    // query.app = this.adsSecuryty();
    return this._http.post(this.url + modelo, query).pipe(
      catchError(this.handleError)
    );
  }
  getFechaServidor() {
    return this._http.get(this.url + 'user/fecha').pipe(
      // retry(3),
      catchError(this.handleError)
    );
  }
}
