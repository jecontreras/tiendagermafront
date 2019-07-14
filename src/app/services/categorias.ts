import { Injectable } from '@angular/core';
import { FactoryModelService } from './factory-model.service'

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  cuerpo: any = {};
  constructor(
    private _model: FactoryModelService
  ) {
    this.cuerpo = this._model;
  }
  get(query: any){
    return this._model.query('categoria', query);
  }
  saved (query: any){
    return this._model.create('categoria', query);
  }
  edit(query:any){
    return this._model.update('categoria', query.id, query);
  }
  articuloCategoria(query: any){
    return this._model.create('articulocategoria', query);
  }
  articuloCategoriaget(query: any){
    return this._model.query('articulocategoria', query);
  }
  articuloCategoriadelete(query: any){
    return this._model.delete('articulocategoria', query.id, query);
  }
}
