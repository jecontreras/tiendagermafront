import { Component, OnInit } from '@angular/core';
import { MercadoService } from './../../../services/mercados.service';
import { ToolsService } from './../../../services/tools.service';
import * as _ from 'lodash';
import swal from 'sweetalert';
import { GLOBAL } from './../../../services/global';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mercados',
  templateUrl: './mercados.component.html',
  styleUrls: ['./mercados.component.css']
})
export class MercadosComponent implements OnInit {

  public disable: boolean = false;
  public data: any = {};
  public list: any = [];
  public clone: any = [];
  constructor(
    private _mercados: MercadoService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    const
      query: any ={
        where:{
          // empresa: 1
        },
        limit: 10
      }
    ;
    this._mercados.get(query)
    .subscribe(
      (res: any)=>{
        console.log(res.data);
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
      this.data = {};
    }
  }
  saved(){
    const
      query: any = this.data
    ;
    if(query.titulo){
      query.slug = _.kebabCase(query.titulo)
      this._mercados.saved(query)
      .subscribe(
        (res: any)=>{
          console.log(res);
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
          this._mercados.edit(query)
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
