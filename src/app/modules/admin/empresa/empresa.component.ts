import { Component, OnInit } from '@angular/core';
import { TiendasService } from './../../../services/tiendas.service';
import { ToolsService } from './../../../services/tools.service';
import * as _ from 'lodash';
import swal from 'sweetalert';
import { GLOBAL } from './../../../services/global';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {

  public disable: boolean = false;
  public data: any = {};
  public list: any = [];
  public clone: any = [];
  constructor(
    private _tiendas: TiendasService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    const
      query: any ={
        where:{
        },
        limit: 10
      }
    ;
    this._tiendas.get(query)
    .subscribe(
      (res: any)=>{
        // console.log(res.data);
        this.list = _.unionBy(this.list || [], res.data, 'id');
      }
    )
    ;
  }

  add(data: any){
    this.disable = !this.disable;
    if(data){
      this.clone = _.clone(data);
      this.data = data;
    }else{
      this.clone = {};
      this.data = {
        codigo: this.codigo()
      };
    }
  }
  codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }
  saved(){
    const
      query: any = this.data
    ;
    if(query.empresa){
      query.slug = _.kebabCase(query.empresa)
      // console.log(query);
      this._tiendas.saved(query)
      .subscribe(
        (res: any)=>{
          // console.log(res);
          if(res){
            this.data = {};
            this.list.push(res);
            swal("Completado!", "Agregado Correctamente!", "success");
            this.disable = !this.disable;
          }else{
            swal("Fallo!", "Error al Agregar!", "error");
          }
        }
      )
      ;
    }else{
      swal("Fallo!", "Error Agrege un Titulo!", "error");
    }
  }
  blur(opt: string){
    // console.log(opt, this.clone, this.data);
    if(this.data[opt] !== this.clone[opt]){
      const
        query : any = {
          id: this.data.id
        }
        ;
        query[opt] = this.data[opt];
        if(query.id){
          this._tiendas.edit(query)
          .subscribe(
            (res: any)=>{
              // console.log(res);
              if(res){
                this._tools.openSnack('Actualizado '+opt, 'Ok', false);
              }
            }
          )
          ;
        }
    }
  }

}
