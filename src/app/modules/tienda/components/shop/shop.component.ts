import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TiendasService } from './../../../../services/tiendas.service';
import { CategoriasService } from './../../../../services/categorias';
import { Shop } from './../../../../models/shop';
import { ProductoService } from './../../../../services/producto';
import { MercadoService } from './../../../../services/mercados.service';
import { ColoresService } from './../../../../services/colores.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  public slug: any;
  public data: any = {};
  public listproductpres: any = [];
  public listProduct: any = [];
  public query: any = {
    where:{},
    limit: 10,
    skip: 0
  };
  public ordenar: any = {};
  public count: any = 0;
  public listmercados: any = [];
  public searcht: any = {
    where:{}
  };
  public listcolor: any = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _Tienda: TiendasService,
    private _color: ColoresService,
    private _mercados: MercadoService,
    private _Producto: ProductoService,
    private _Categoria: CategoriasService
  ) {
    this.data = {};
    this.getmercados(null);
    this.initial();
  }
  ngOnInit(){

  }
  initial(){
    this.data = {
      empresa: ''
    }
    this.route.params.subscribe(params => {
       if(params['id']!=null){
         this.slug = params['id'];
         // console.log(this.slug);
         if(this.slug === 'new'){
           this.query.sort ='createdAt DESC';
           this.getProduct(null, null);
         }else if(this.slug === 'tec'){
           this.getmercados("tecnologia");
         }else if(this.slug === 'pc'){
           this.getmercados("computadores");
         }else if(this.slug === 'gamer'){
           this.getmercados("gamer");
         }else if(this.slug === 'des'){
           this.query.sort ='costopromosion DESC';
           this.getProduct(null, null);
         }else{
           this.getTienda();
           // this.searcht.txt = this.slug;
           // this.getsearh();
         }
       }else{
         const
           query:any = localStorage.getItem('consulta');
         ;
          // console.log(query);
         if(query){
           this.searcht.txt = query;
           this.getsearh();
           localStorage.removeItem('consulta');
         }else{
           this.getProduct(null, null);
         }
       }
    });
  }
  getmercados(obj: any){
    const
      query: any = {
        where:{},
        limit: -1
      }
    ;
    if(obj){
      query.where.titulo = obj;
    }
    return this._mercados.get(query)
    .subscribe(
      (res: any)=>{
        // console.log(res);
        res = res.data;
        if(obj){
          if(res[0]){
            this.query.where.tipomercado = res[0].id;
          }else{
            this.query.where.tipomercado = '998';
          }
          this.getProduct(null, null);
        }else{
          this.listmercados = res;
        }
        this.color(null);
      }
    );
  }
  color(data: any){
    // console.log(data);
    var
      query = {}
    ;
    if(data){
      query = {
        id: data.color
      };
    }
    // console.log(data);
    return this._color.get({
      where: {
        color: {'!': 'varias'}
      },
      limit: -1
     })
     .subscribe(
       (res: any)=>{
         // console.log(res);
         if(!data){
           this.listcolor = res.data;
         }else{
           data.color = res.data[0];
         }
       }
     )
     ;
  }
  getTienda(){
    // console.log(this.slug, this.query);
    if(this.slug !== 'new' && this.slug !== 'tec' && this.slug !== 'pc' && this.slug !== 'des' && this.slug){
      return this._Tienda.get({
        where:{
          url: this.slug || ''
        },
        limit: 1
      })
      .subscribe(
        (res: any)=>{
          // console.log(res);
          res = res.data[0];
          if(res){
            this.data = res;
            this.getProduct(res, null);
          }
        }
      )
      ;
    }else{
      if(this.slug !== 'tec' || this.slug !== 'pc' || this.slug !== 'gamer'){
        this.query={where:{tipomercado: this.query.where.tipomercado},limit:10,skip:0};
      }else{
        if(this.slug !== 'des' || this.slug !== 'new'){
          this.query={where:{},sort: this.query.sort, limit:10,skip:0};
        }else{
          this.query={where:{},limit:10,skip:0};
        }
      }
      // console.log(this.query);
      this.getProduct(null, null);
    }
  }
  pageEvent(ev){
    // console.log(ev);
    // ev.pageIndex = 10;
    ev.pageSize = 10;
    ev.pageSize= ev.pageSize*ev.pageIndex;
    this.getProduct(null, ev);
  }
  getsearh(){
    if(this.searcht.txt){
      this.query.where.or = [
        {
          codigo:{
            contains: this.searcht.txt || ''
          }
        },
        {
          titulo: {
            contains: this.searcht.txt || ''
          }
        },
        {
          slug: {
            contains: this.searcht.txt || ''
          }
        },
        {
          tipo:{
            contains: this.searcht.txt || ''
          }
        },
        {
          estado:{
            contains: this.searcht.txt || ''
          }
        },
        {
          opcion:{
            contains: this.searcht.txt || ''
          }
        }
      ];
    }
    this.listProduct = [];
    if(this.searcht.ordenar){
      if(this.searcht.ordenar === "mejor-valor"){
        this.query.sort ='megusta DESC';
      }else if(this.searcht.ordenar === "nuevo"){
        this.query.sort ='createdAt DESC';
      }else if(this.searcht.ordenar === "precio-mayor"){
        this.query.sort ='costoventa DESC';
      }else{
        this.query.sort ='costoventa asc';
      }
    }
    console.log(this.query, this.searcht);
    this.getProduct(null, null);
  }
  getProduct(obj: any, paginate: any){
    if(obj){
      this.query.where.empresa = obj.id;
    }else{
      if(!paginate){
        paginate = {
          pageIndex: 1,
          pageSize: 10
        };
      }
      this.query.limit = paginate.pageSize;
      this.query.skip = paginate.pageIndex;
    }
    // console.log(this.query);
    return this._Producto.get(this.query)
    .subscribe(
      (res: any)=>{
        // console.log(res);
        this.count = res.count;
        res = res.data;
        for (var i = 0; i < res.length; i++) {
          res[i]
          if(i<=3){
            this.listproductpres.push(res[i]);
          }
        }
        // console.log(this.listproductpres);
        this.listProduct = _.unionBy(this.listProduct || [], res, 'id');
      }
    )
  }

  agregar(obj: any){
    if(obj){
      const
        articulo: any = JSON.parse(localStorage.getItem('articulos')) || []
      ;
      const
        idx: any = _.findIndex(articulo, ['id', obj.id])
      ;
      // console.log(articulo)
      // console.log(idx);
      if (idx === -1) {
        articulo.push(obj);
        localStorage.removeItem('articulos');
        localStorage.setItem('articulos', JSON.stringify(articulo));
      }
    }
  }
}
