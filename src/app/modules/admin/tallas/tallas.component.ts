import { Component, OnInit } from '@angular/core';
import { TallaService } from './../../../services/talla.service';
import { ToolsService } from './../../../services/tools.service';
import * as _ from 'lodash';
import swal from 'sweetalert';
import { GLOBAL } from './../../../services/global';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'marcas',
  templateUrl: './tallas.component.html',
  styleUrls: ['./tallas.component.css']
})
export class TallasComponent implements OnInit {

  public disable: boolean = false;
  public data: any = {};
  public list: any = [];
  public clone: any = [];
  constructor(
    private _talla: TallaService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    const
      query: any ={
        where:{
          // empresa: 1
        }
      }
    ;
    this._talla.get(query)
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
      this.data = {
        empresa: 1
      };
    }
  }
  saved(){
    const
      query: any = this.data
    ;

    if(query.talla && query.empresa){
      query.slug = _.kebabCase(query.talla)
      this._talla.saved(query)
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
          this._talla.edit(query)
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
