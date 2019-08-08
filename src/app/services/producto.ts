import { Injectable } from '@angular/core';
import { FactoryModelService } from './factory-model.service'
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  cuerpo: any = {};
  constructor(
    private _model: FactoryModelService
  ) {
    this.cuerpo = this._model;
  }
  get(query: any){
    return this._model.query('articulo', query);
  }
  saved (query: any){
    return this._model.create('articulo', query);
  }
  edit(query:any){
    return this._model.update('articulo', query.id, query);
  }
  getGaleria(query: any){
    return this._model.query('galeria', query);
  }
}
