import { Injectable } from '@angular/core';
import { FactoryModelService } from './factory-model.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  cuerpo: any = {};
  constructor(
    private _model: FactoryModelService
  ) {
    this.cuerpo = this._model;
  }
  get(query: any){
    return this._model.query('app', query);
  }
  saved (query: any){
    return this._model.create('app', query);
  }
  edit(query:any){
    return this._model.update('app', query.id, query);
  }
}
