import { Injectable } from '@angular/core';
import { FactoryModelService } from './factory-model.service'

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {
  cuerpo: any = {};
  constructor(
    private _model: FactoryModelService
  ) {
    this.cuerpo = this._model;
  }
  get(query: any){
    return this._model.query('galeria/query', query);
  }
  pushfile(obj: any) {
    const
      form = new FormData()
    ;
    if (obj) {
      form.append('file', obj[0]);
      return this._model.create('galeria/file', form);
    }
  }
  deletefile(obj: any) {
    if (obj) {
      return this._model.get('galeria/deletefile', {
        name: obj
      })
      ;
    }
  }
}
