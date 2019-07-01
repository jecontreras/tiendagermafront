import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TiendasService } from './../../../../services/tiendas.service';
import { CategoriasService } from './../../../../services/categorias';
import { Shop } from './../../../../models/shop';
import { ProductoService } from './../../../../services/producto';
import * as _ from 'lodash';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['/shop.component.scss']
})
export class ShopComponent implements OnInit {
  public slug: any = {};
  public data: any = {};
  public listproductpres: any = [];
  public listProduct: any = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _Tienda: TiendasService,
    private _Producto: ProductoService,
    private _Categoria: CategoriasService
  ) {
    this.data = {};
  }
  ngOnInit(){
    this.data = {
      id: 1,
      empresa: 'Tienda Universal'
    }
    this.route.params.subscribe(params => {
       if(params['id']!=null){
         this.slug = params['id'];
         console.log(params);
         this.getTienda();
       }else{
         this.getProduct(null);
       }
    });
  }
  getTienda(){
    return this._Tienda.get({
      where:{
        url: this.slug
      },
      limit: 1
    })
    .subscribe(
      (res: any)=>{
        console.log(res);
        res = res.data[0];
        if(res){
          this.data = res;
          this.getProduct(res);
        }
      }
    )
    ;
  }
  getProduct(obj: any){
    var
      querys: any = {}
    ;
    if(obj){
      querys = {
        empresa: obj.id
      }
      ;
    }
    return this._Producto.get({
      where: querys,
      // sort: {
      //   posicion: 'asc'
      // },
      skip: 1,
      limit: 10
    })
    .subscribe(
      (res: any)=>{
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
      console.log(articulo)
      // console.log(idx);
      if (idx === -1) {
        articulo.push(obj);
        localStorage.removeItem('articulos');
        localStorage.setItem('articulos', JSON.stringify(articulo));
      }
    }
  }
}
