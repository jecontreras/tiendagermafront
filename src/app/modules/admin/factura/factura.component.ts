import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TiendasService } from './../../../services/tiendas.service';
import { MercadoService } from './../../../services/mercados.service';
import { UsuariosService } from './../../../services/usuarios.service';
import { ToolsService } from './../../../services/tools.service';
import { ArchivoService } from './../../../services/archivo.service';
import { FactoryModelService } from './../../../services/factory-model.service';
import { CartService } from './../../../services/factura.service';
import * as _ from 'lodash';
import swal from 'sweetalert';
import { GLOBAL } from './../../../services/global';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

  public disable: boolean = false;
  public data: any = {};
  public list: any = [];
  public clone: any = [];
  public listmercados: any = [];
  public user: any = {};
  public img: any = [];
  public datafile: any;
  public carga: boolean= true;
  public listfact: any = [];
  public count: any = 0;
  public searcht: any ={
    txt: ''
  };
  public query: any = {where:{}};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _model: FactoryModelService,
    private _archivos: ArchivoService,
    private _tiendas: TiendasService,
    private _mercados: MercadoService,
    private _user: UsuariosService,
    private _cart: CartService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.user = this._model.user;
    // console.log(this.user);
    this.route.params.subscribe(params => {
      // console.log(params);
       if(params['id']!=null){
        this.getlist(params['id'], null);
      }else{
        const
          paginate: any = {
            pageIndex: 0,
            pageSize: 10
          }
        ;
        this.getlist(null, paginate);
      }
    });
  }
  pageEvent(ev){
    // console.log(ev);
    ev.pageIndex = 0;
    ev.pageSize = 10;
    this.getlist(null, ev);
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
          cantidad:{
            contains: parseInt(this.searcht.txt) || ''
          }
        },
        {
          total:{
            contains: parseInt(this.searcht.txt) || ''
          }
        },
        {
          subtotal:{
            contains: parseInt(this.searcht.txt) || ''
          }
        },
        {
          estado:{
            contains: this.searcht.txt || ''
          }
        },
        {
          ciudad:{
            contains: this.searcht.txt || ''
          }
        },
        {
          codigo:{
            contains: this.searcht.txt || ''
          }
        },
        {
          fechaentrega:{
            contains: this.searcht.txt || ''
          }
        },
        {
          fechamaxima:{
            contains: this.searcht.txt || ''
          }
        },
        {
          pais:{
            contains: this.searcht.txt || ''
          }
        },
        {
          provivencia:{
            contains: this.searcht.txt || ''
          }
        },
        {
          direccion1:{
            contains: this.searcht.txt || ''
          }
        },
        {
          codigopostal:{
            contains: this.searcht.txt || ''
          }
        }
      ];
    }else{
      delete this.query.where.or;
    }
    this.list = [];
    // console.log(this.query);
    this.getlist(null, paginate);
  }
  getlist(obj: any, paginate: any){
    if(!paginate){
      paginate = {
        pageIndex: 0,
        pageSize: 10
      };
    }
    if((this._model.user.rol.nombre === "admin")){
      this.query.where.empresa = this._model.user.empresa;
    }else{
      this.query.where.cartpadre= null;
      if(this._model.user.rol.nombre === "usuario"){
        this.query.where.user = this._model.user.id;
      }
    }
    if(obj){
      if(this._model.user.rol.nombre === "super admin" || this._model.user.rol.nombre === "usuario"){
        this.query.where.cartpadre = obj;
      }
      return this._cart.get({
        where:{
          id: obj
        }
      })
      .subscribe(
        (car: any)=>{
          // console.log(car);
          car = car.data[0];
          if(car){
            if(!car.cartpago){
              car.cartpago = {};
            }
            this.data = car;
            // console.log(query, this._model.user.empresa);
            return this._cart.get(this.query)
            .subscribe(
              (res: any)=>{
                // console.log(res);
                res = res.data;
                _.forEach(res, (item)=>{
                  return this._model.query('cart/getcompleto',{
                    where: {
                      id: item.id
                    }
                  })
                  .subscribe(
                    (res: any)=>{
                      res = res.data;
                      // console.log(res);
                      if(res){
                        // this.listfact.push(res);
                        this.add(res);
                      }
                    }
                  )
                  ;
                })
                ;
              }
            )
            ;
          }

        }
      )
    }else{
      // console.log(query, paginate);
      this.query.limit = paginate.pageIndex;
      this.query.skip = paginate.pageSize;
      return this._cart.get(this.query)
      .subscribe(
        (res: any)=>{
          // console.log(res);
          this.count = res.count;
          this.list = _.unionBy(this.list || [], res.data, 'id');
        }
      )
      ;
    }
  }

  add(data: any){
    if(data){
      this.disable = true;
      // console.log(data);
      if(!data.pago){
        data.pago = {};
      }
      data.clone = _.clone(data);
      this.listfact.push(data);
      // console.log(this.listfact);
      // this.clone = _.clone(data);
      // if(!data.pago){
      //   data.pago = {};
      // }
      // this.data = data;
    }else{
      // this.disable = !this.disable;
      this.clone = {};
      this.data = {
        empresa: this.user.empresa,
        pago: {},
        user: {}
      };
      this.router.navigate(['admin/factura']);
    }
  }
  saved(){
    const
      query: any = this.data
    ;

    if(query.talla && query.empresa){
      query.slug = _.kebabCase(query.talla)
      this._cart.saved(query)
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
  blur(opt: string, item: any){
    // console.log(opt, this.clone, this.data);
    if(item){
      if(item[opt] !== item.clone[opt]){
        const
          query : any = {
            id: item.id
          }
          ;
          query[opt] = item[opt];
          if(query.id){
            this._cart.edit(query)
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
    }else{
      if(this.data[opt] !== this.clone[opt]){
        const
          query : any = {
            id: this.data.id
          }
          ;
          query[opt] = this.data[opt];
          if(query.id){
            this._cart.edit(query)
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

}
