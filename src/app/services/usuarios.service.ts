import { Injectable } from '@angular/core';
import { FactoryModelService } from './factory-model.service'

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  cuerpo: any = {};
  constructor(
    private _model: FactoryModelService
  ) {
    this.cuerpo = this._model;
  }
  get(query: any){
    return this._model.query('user', query);
  }
  saved (query: any){
    return this._model.create('user/register', query);
  }
  edit(query:any){
    return this._model.update('user', query.id, query);
  }
}
