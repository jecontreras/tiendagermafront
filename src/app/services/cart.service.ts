import { Injectable } from '@angular/core';
import { FactoryModelService } from './factory-model.service'

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cuerpo: any = {};
  constructor(
    private _model: FactoryModelService
  ) {
    this.cuerpo = this._model;
  }
  get(query: any){
    return this._model.query('cart', query);
  }
  getcart(query: any){
    return this._model.query('cart/getcompleto', query);
  }
  saved (query: any){
    return this._model.create('cart', query);
  }
  savedarticulo(query: any){
    return this._model.create('cartarticulo', query);
  }
  generate(query: any){
    return this._model.create('cart/generateCar', query);
  }
  validarart(query: any){
    return this._model.create('cart/validarart', query);
  }
  edit(query:any){
    return this._model.update('cart', query.id, query);
  }
}
