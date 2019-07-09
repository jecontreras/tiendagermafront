import { Component, OnInit } from '@angular/core';
import { of, Observable, throwError} from 'rxjs';
import * as _ from 'lodash';
import { ToolsService } from './../../../../services/tools.service';
import { CategoriasService } from './../../../../services/categorias';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['/index.component.scss']
})
export class IndexComponent implements OnInit {
  public listcategorias:any = [];
  public listCart: any = [];
  public data: any = {};

  showFiller = false;

  events: string[] = [];
  opened: boolean;

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  constructor(
    private _tools: ToolsService,
    private _categoria: CategoriasService
  ) {
  }
  ngOnInit(){
    this.getlist();
    this.getcart();
  }
  getlist(){
    this._categoria.get({
      where:{
        categoriaDe: 'categoria'
      }
    })
    .subscribe(
      (rta: any)=>{
        rta = rta.data;
        console.log(rta);
        this.listcategorias = rta;
      }
    )
    ;
  }
  getcart(){
    const
      articulo: any = JSON.parse(localStorage.getItem('articulos')),
      entrega: string='free'
    ;
    var
      subtotal: any= 0,
      descuento: any= 0,
      total: any= 0
    ;
    this.listCart = articulo;
    _.forEach(articulo, function(item){
      if(item.costoventa){
        subtotal+=item.costoventa;
      }
      if(item.costopromosion){
        descuento+=item.costoventa-item.costopromosion;
      }
    })
    ;
    total = subtotal-descuento;
    this.data.codigo = this.codigo();
    this.data.subtotal = subtotal;
    this.data.entrega = entrega;
    this.data.descuento = descuento;
    this.data.total = total;
    this.data.articulo = articulo;
    localStorage.setItem('shop', JSON.stringify(this.data));
  }
  codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }
}
