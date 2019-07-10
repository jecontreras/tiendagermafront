import { Component, OnInit } from '@angular/core';
import { CategoriasService } from './../../../services/categorias';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolsService } from './../../../services/tools.service';
import * as _ from 'lodash';
import swal from 'sweetalert';
import { GLOBAL } from './../../../services/global';
import { FactoryModelService } from './../../../services/factory-model.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.css']
})
export class MarcasComponent implements OnInit {

  public disable: boolean = false;
  public data: any = {};
  public list: any = [];
  public clone: any = [];
  public user: any = {};
  constructor(
    private _categoria: CategoriasService,
    private _tools: ToolsService,
    private route: ActivatedRoute,
    private router: Router,
    private _model: FactoryModelService,
  ) { }

  ngOnInit() {
    this.user = this._model.user;
    if(this._model.user.rol.nombre !== "super admin" && this._model.user.rol.nombre !== "admin"){
      this.router.navigate(['admin/dashboard']);
    }
    this.getlist();
  }
  getlist(){
    const
      query: any ={
        where:{
          categoriaDe: 'marca',
          empresa: this.user.empresa
        }
      }
    ;
    if(this.user.rol.nombre === "super admin"){
      delete query.where.empresa;
    }
    this._categoria.get(query)
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
        empresa: this.user.empresa
      };
    }
  }
  saved(){
    const
      query: any = this.data
    ;
    if(query.categoria){
      query.categoriaDe = 'marca';
      query.slug = _.kebabCase(query.categoria)
      this._categoria.saved(query)
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
          this._categoria.edit(query)
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
