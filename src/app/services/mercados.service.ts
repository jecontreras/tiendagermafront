import { Injectable } from '@angular/core';
import { FactoryModelService } from './factory-model.service'

@Injectable({
  providedIn: 'root'
})
export class MercadoService {
  cuerpo: any = {};
  constructor(
    private _model: FactoryModelService
  ) {
    this.cuerpo = this._model;
  }
  get(query: any){
    return this._model.query('mercados', query);
  }
  getMercado(query: any){
    return this._model.query('empresamercado', query);
  }
  savedMercado (query: any){
    return this._model.create('empresamercado', query);
  }
  deleteMercado (query: any){
    return this._model.delete('empresamercado',query.id, query);
  }
  saved (query: any){
    return this._model.create('mercados', query);
  }
  edit(query:any){
    return this._model.update('mercados', query.id, query);
  }
}
