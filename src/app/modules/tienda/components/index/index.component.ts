import { Component, OnInit } from '@angular/core';
import { of, Observable, throwError} from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { ToolsService } from './../../../../services/tools.service';
import { CategoriasService } from './../../../../services/categorias';
import { ColoresService } from './../../../../services/colores.service';
import { TallaService } from './../../../../services/talla.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  public listcategorias:any = [];
  public listCart: any = [];
  public data: any = {};
  public search: any = '';

  showFiller = false;

  events: string[] = [];
  opened: boolean;

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _tools: ToolsService,
    private _color: ColoresService,
    private _talla: TallaService,
    private _categoria: CategoriasService
  ) {
    this.getlist();
    // this.getcart();
  }
  ngOnInit(){
  }
  eventocart(){
    // console.log("ehy")
    this.getcart();
  }
  getsearch(){
    localStorage.setItem('consulta', this.search);
    this.router.navigate(['/tienda/shop']);
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
        // console.log(rta);
        this.listcategorias = rta;
      }
    )
    ;
  }
  getcart(){
    const
      articulo: any = JSON.parse(localStorage.getItem('articulos'))
    ;
    var
      subtotal: any= 0,
      descuento: any= 0,
      costoenvio: any = 0,
      total: any= 0
    ;
    // console.log(articulo);
    if(articulo){
      this.listCart = articulo.articulo;
      _.forEach(articulo.articulo, (item: any)=>{
        costoenvio+=parseInt(item.costoenvio);
        if(item.costopromosion){
          subtotal+=item.costopromosion*parseInt(item.cantidadadquiridad);
          descuento+=item.costopromosion-item.costoventa;
        }
        if(item.costoventa && !item.costopromosion){
          subtotal+=item.costoventa*parseInt(item.cantidadadquiridad);
        }
        // console.log(item);
        if(item.color){
          this.getcolor(item.color)
          .subscribe(
            (res: any)=>{
              // console.log(res);
              res = res.data[0];
              if(item.color.color){
                item.color = item.color.color;
              }
              if(res){
                item.color = res.color;
              }
            }
          );
        }
        if(item.talla){
          this.getTalla(item.talla)
          .subscribe(
            (res: any)=>{
              // console.log(res);
              res = res.data[0];
              if(res){
                item.talla = res.talla;
              }
            }
          );
        }
      })
      ;
      total = subtotal;
      this.data.codigo = this.codigo();
      this.data.subtotal = subtotal;
      this.data.entrega = costoenvio;
      this.data.descuento = descuento;
      this.data.total = total;
      this.data.articulo = articulo.articulo;
      this.data.infextras = articulo.infextras;
    }
    // localStorage.setItem('shop', JSON.stringify(this.data));
  }
  // deleteart(obj: any, idx: any){
  //
  // }
  deleteart(){
    this.data.subtotal = 0;
    this.data.descuento = 0;
    var
      costoenvio: any = 0
    ;
    _.forEach(this.data.articulo,(item: any) =>{
      item.cantidadadquiridad = parseInt(item.cantidadadquiridad);
      costoenvio+=item.costoenvio;
      if(item.costopromosion){
        this.data.subtotal+=item.costopromosion*parseInt(item.cantidadadquiridad);
        this.data.descuento+=item.costopromosion-item.costoventa;
      }
      if(item.costoventa && !item.costopromosion){
        this.data.subtotal+=item.costoventa*parseInt(item.cantidadadquiridad);
      }
    });
    this.data.entrega = costoenvio;
    this.data.total = this.data.subtotal;
    const
      query:any = this.data
    ;
    localStorage.removeItem('articulos');
    localStorage.setItem('articulos', JSON.stringify(query));
    this.data.total = this.data.subtotal + this.data.descuento +this.data.entrega;
  }
  getcolor(obj: any){
    return this._color.get({
      where:{
        id: obj.color
      }
    });
  }
  getTalla(obj: any){
    return this._talla.get({
      where:{
        id: obj.talla
      }
    });
  }
  codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }
}
