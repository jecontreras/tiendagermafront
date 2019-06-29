import { Injectable } from '@angular/core';
import { FactoryModelService } from './factory-model.service'

@Injectable({
  providedIn: 'root'
})
export class TiendasService {
  cuerpo: any = {};
  constructor(
    private _model: FactoryModelService
  ) {
    this.cuerpo = this._model;
  }
  get(query: any){
    return this._model.query('empresa', query);
  }
  saved (query: any){
    return this._model.create('empresa', query);
  }
  edit(query:any){
    return this._model.update('empresa', query.id, query);
  }
  pushfile(obj: any) {
    console.log(this._model);
    const
      form = new FormData()
    ;
    // tslint:disable-next-line:quotemark
    if (obj) {
      form.append('file', obj[0]);
      return this._model.create('empresa/file', form);
    } else {
      // cuerpo._tools.openSnack('Error', false);
    }
  }
  deletefile(obj: any ) {
    if (obj) {
      return this._model.get('empresa/deletefile', {
        name: obj
      })
      ;
    }
  }
}
