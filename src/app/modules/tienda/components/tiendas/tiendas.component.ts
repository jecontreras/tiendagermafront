import { Component, OnInit } from '@angular/core';
import { ToolsService } from './../../../../services/tools.service';
import { TiendasService } from './../../../../services/tiendas.service';
import { CategoriasService } from './../../../../services/categorias';
import * as _ from 'lodash';
// import swal from 'sweetalert';
@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.component.html',
  styleUrls: ['/tiendas.component.scss']
})
export class TiendasComponent implements OnInit {

  public listtiendas: any = [];
  public listcategorias: any = [];

  constructor(
    private _tools: ToolsService,
    private _tiendas: TiendasService,
    private _categoria: CategoriasService
  ) {

  }
  ngOnInit(){
    this.get();
    this.getCategorias();
  }
  get(){
    this._tiendas.get({
      where:{
        estado: 'activo'
      },
      limit: 10
    })
    .subscribe(
      (res: any)=>{
        console.log(res);
        res = res.data;
        this.listtiendas = _.unionBy(this.listtiendas || [], res, 'id');
      }
    )
    ;
  }
  getCategorias(){
    return this._categoria.get({
      where:{
        categoriaDe: ['articulo']
      }
    })
    .subscribe(
      (res: any)=>{
        // console.log(res);
        res = res.data;
        this.listcategorias = _.groupBy(res, 'categoriaDe');
        // console.log(this.listcategorias);
      }
    )
    ;
  }
}
