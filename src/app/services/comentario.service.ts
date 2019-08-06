import { Injectable } from '@angular/core';
import { FactoryModelService } from './factory-model.service'

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  cuerpo: any = {};
  constructor(
    private _model: FactoryModelService
  ) {
    this.cuerpo = this._model;
  }
  get(query: any){
    return this._model.query('comentario', query);
  }
  saved (query: any){
    return this._model.create('comentario', query);
  }
  edit(query:any){
    return this._model.update('comentario', query.id, query);
  }
}
