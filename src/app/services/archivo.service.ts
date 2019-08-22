import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { FactoryModelService } from './factory-model.service'
import * as _ from 'lodash';

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
  pushfile(obj: any, data: any, modelo: any) {
    const
      form = new FormData()
    ;
    if (obj) {
      form.append('file', obj[0]);
      return this._model.create('galeria/file', form)
      .pipe(
        map((res: any)=>{
          // console.log(res);
          if(res.status === 200){
            res = res.files;
            const
              // url:any = _.split(res[0].fd,"images", 10)
              url: any = "https://publihazclick.s3.amazonaws.com/venty/"+res.fd;
            ;
            // console.log(url);
            if(data){
              // data.url2 = this._model.url+"images"+url[1];
              data.url2 = url;
              // data.infodrive = res[0];
              this.getGaleria(data, modelo,);
              return url;
            }else{
              return url;
            }
          }
          return false;
        })
      )
      ;
    }
  }
  getGaleria(obj: any, modelo: any){
    const
      query: any = {
        where: {}
      }
    ;
    query.where[modelo]= obj.id;
    return this._model.query("galeria",query)
    .subscribe(
      (res: any)=>{
        // console.log(res);
        res = res.data[0];
        if(res){
          obj.galeria = res.id;
          this.createArchivo(obj)
          .subscribe(
            ()=>{
              // console.log(rta);
            }
          );
        }else{
          this.createGaleria(obj, modelo)
          .subscribe(
            (rta: any)=>{
              if(rta){
                obj.galeria = rta.id;
                this.createArchivo(obj)
                .subscribe(
                  ()=>{
                    // console.log(rta);
                  }
                );
              }
            }
          );
        }
      }
    )
    ;
  }
  createGaleria(obj: any, modelo: any){
    const
      query: any = {
        titulo: new Date(),
      }
    ;
    query[modelo]= obj.id;
    return this._model.create("galeria",query)
  }
  createArchivo(obj: any){
    // console.log(obj);
    return this._model.create("archivo",{
      foto: obj.url2,
      // infodrive: obj.infodrive,
      galeria: obj.galeria
    })
    ;

  }
  deletefile(query: any) {
    if (query) {
      query.disable=false;
      return this._model.query('galeria/deletefile', query)
      ;
    }
  }
}
