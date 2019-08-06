import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MercadoService } from './../../../services/mercados.service';
import { ToolsService } from './../../../services/tools.service';
import * as _ from 'lodash';
import swal from 'sweetalert';
import { GLOBAL } from './../../../services/global';
import { FactoryModelService } from './../../../services/factory-model.service';

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
  public count: any = 0;
  public searcht: any ={
    txt: ''
  };
  public query: any = {where:{}};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _model: FactoryModelService,
    private _mercados: MercadoService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    if(this._model.user.rol.nombre !== "super admin"){
      this.router.navigate(['admin/dashboard']);
    }
    const
      paginate: any = {
        pageIndex: 10,
        pageSize: 0
      }
    ;
    this.getlist(paginate);
  }
  pageEvent(ev){
    // console.log(ev);
    ev.pageIndex = 10;
    ev.pageSize+= 1;
    this.getlist(ev);
  }
  getsearh(){
    const
      paginate: any = {
        pageIndex: 10,
        pageSize: 0
      }
    ;
    if(this.searcht.txt){
      this.query.where.or = [
        {
          titulo:{
            contains: this.searcht.txt || ''
          }
        },
        {
          slug:{
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
    this.query.limit = paginate.pageIndex;
    this.query.skip = paginate.pageSize;
    this._mercados.get(this.query)
    .subscribe(
      (res: any)=>{
        // console.log(res.data);
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
