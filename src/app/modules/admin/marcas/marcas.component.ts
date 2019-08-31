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
  public count: any = 0;
  public searcht: any ={
    txt: ''
  };
  public query: any = {where:{}};
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
    const
      paginate: any = {
        pageIndex: 0,
        pageSize: 10
      }
    ;
    this.getlist(paginate);
  }
  pageEvent(ev){
    // console.log(ev);
    ev.pageIndex = 0;
    ev.pageSize = 10;
    this.getlist(ev);
  }
  getsearh(){
    const
      paginate: any = {
        pageIndex: 0,
        pageSize: 10
      }
    ;
    if(this.searcht.txt){
      this.query.where.or = [
        {
          categoria:{
            contains: this.searcht.txt || ''
          }
        },
        {
          slug:{
            contains: this.searcht.txt || ''
          }
        },
        {
          categoriaDe:{
            contains: this.searcht.txt || ''
          }
        }
      ];
    }else{
      delete this.query.where.or;
    }
    this.list = [];
    // console.log(this.query);
    this.getlist(paginate);
  }
  getlist(paginate: any){
    this.query.where.categoriaDe = "marca";
    this.query.where.empresa = this.user.empresa;
    this.query.limit = paginate.pageSize;
    this.query.skip = paginate.pageIndex;
    if(this.user.rol.nombre === "super admin"){
      delete this.query.where.empresa;
    }
    // this.query.where.estado = 'activo';
    this.query.sort ='createdAt DESC';
    this._categoria.get(this.query)
    .subscribe(
      (res: any)=>{
        // console.log(res);
        this.count = res.count;
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
