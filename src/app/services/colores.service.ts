import { Injectable } from '@angular/core';
import { FactoryModelService } from './factory-model.service'

@Injectable({
  providedIn: 'root'
})
export class ColoresService {
  cuerpo: any = {};
  constructor(
    private _model: FactoryModelService
  ) {
    this.cuerpo = this._model;
  }
  get(query: any){
    return this._model.query('color', query);
  }
  saved (query: any){
    return this._model.create('color', query);
  }
  edit(query:any){
    return this._model.update('color', query.id, query);
  }
}
