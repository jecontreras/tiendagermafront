import { Component, OnInit } from '@angular/core';
import { ProductoService } from './../../../services/producto';
import { ToolsService } from './../../../services/tools.service';
import { CategoriasService } from './../../../services/categorias';
import { TallaService } from './../../../services/talla.service';
import { ColoresService } from './../../../services/colores.service';
import { FactoryModelService } from './../../../services/factory-model.service';
import { ArchivoService } from './../../../services/archivo.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import swal from 'sweetalert';
import { GLOBAL } from './../../../services/global';

@Component({
  selector: 'productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  public disable:boolean = false;
  data:any = {};
  clone:any = {};
  img: any;
  list:any = [];
  datafile: any = {};
  public global  =  GLOBAL;
  public listcategoria: any = [];
  public listmarca: any = [];
  public listcolor: any = [];
  public listtalla: any = [];
  public listgaleria: any = [];
  public user: any = {};
  public carga: boolean= true;
  cuerpo: any = {};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _model: FactoryModelService,
    private _producto: ProductoService,
    private _categoria: CategoriasService,
    private _archivos: ArchivoService,
    private _talla: TallaService,
    private _color: ColoresService,
    private _tools: ToolsService
  ) {
    this.cuerpo = _producto;
  }

  ngOnInit() {
    this.user = this._model.user;
    if(this._model.user.rol.nombre !== "super admin" && this._model.user.rol.nombre !== "admin"){
      this.router.navigate(['admin/dashboard']);
    }
    this.route.params.subscribe(params => {
      // console.log(params);
       if(params['id']!=null){
        this.getlist(params['id']);
      }else{
        this.getlist(null);
      }
    });

  }
  getlist(obj: any){
    const
      data:any = {
        where:{
          empresa: this.user.empresa
        },
        limit: 10
      }
    ;
    if(this.user.rol.nombre === "super admin"){
      delete data.where.empresa;
    }
    if(obj){
      data.where.id = obj;
      data.limit = 1;
    }
    this._producto.get(data)
    .subscribe(
      (res: any) =>{
        // console.log(res.data);
        if(obj){
          this.add(res.data[0]);
        }else{
          this.list = _.unionBy(this.list || [], res.data, 'id');
        }
      }
    );
  }
  add(opt){
    // console.log(opt);
      this.disable = !this.disable;
      if(opt){
        this.clone = _.clone(opt);
        this.data = opt;
        this.getGaleria();
      }else{
        this.clone = {};
        this.data = {
          codigo: this.codigo(),
          empresa: this.user.empresa
        }
        ;
        this.router.navigate(['admin/productos']);
      }
      this.categorias();
  }
  codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }
  getGaleria(){
    return this._producto.getGaleria({
        where:{
          articulo: this.data.id
        },
        limit: 1
      })
      .subscribe(
        (res: any)=>{
          // console.log(res);
          res = res.data[0];
          if(res){
            this.listgaleria = res.archivos;
            if(res.length >=5){
              this.carga=false;
            }
          }
        }
      )
      ;
  }
  categorias(){
    return this._categoria.get({
      where:{
        categoriaDe: ['etiqueta', 'producto'],
        // empresa:
      },
      limit: -1
     })
     .subscribe(
       (res: any)=>{
         // console.log(res);
         this.listcategoria = res.data;
         this.marcas();
       }
     )
     ;
  }
  marcas(){
    return this._categoria.get({
      where:{
        categoriaDe: 'marca'
        // empresa:
      },
      limit: -1
     })
     .subscribe(
       (res: any)=>{
         // console.log(res);
         this.listmarca = res.data;
         this.talla();
       }
     )
     ;
  }
  talla(){
    // console.log(this._talla);
    return this._talla.get({
      where:{
        // empresa: 1
      },
      limit: -1
     })
     .subscribe(
       (res: any)=>{
         // console.log(res);
         this.listtalla = res.data;
         this.color();
       }
     )
     ;
  }
  color(){
    // console.log(this._color);
    return this._color.get({
      where:{
        // empresa: 1
      },
      limit: -1
     })
     .subscribe(
       (res: any)=>{
         // console.log(res);
         this.listcolor = res.data;
       }
     )
     ;
  }
  saved(){
    const
      data: any = this.data
    ;
    if(data.titulo){
      data.slug = _.kebabCase(data.titulo)
      this._producto.saved(data)
      .subscribe(
        (res: any) => {
          // console.log(res);
          if(res){
            this.data = {
              codigo: this.codigo(),
              empresa: this.user.empresa
            };
            data.id = res.id;
            this.list.push(data);
            this.disable = false;
            swal("Completado!", "Agregado Correctamente!", "success");
          }else{
            swal("Fallo!", "Error al Agregar!", "error");
          }
        }
      )
      ;
    }
  }
  blur(obj){
    // console.log(this.data);
    if(this.data.id && this.data[obj] !== this.clone[obj]){
      var
        data: any = {
          id: this.data.id
        }
      ;
      data[obj]=this.data[obj];
      // console.log(data);
      this._producto.edit(data)
      .subscribe(
        (res: any)=> {
          // console.log(res);
          if(res){
            this.list.push(res);
            this._tools.openSnack('Actualizado '+obj, '', false);
          }
        }
      );
    }
  }
  datafiles(ev: any) {
    if(ev){
      this.datafile = ev.target.files;
    }
    // console.log(this.datafile);
  }
  file(data: any) {
    // if(this.img){
    const
      file = this.datafile
      ;
    // console.log(file);
    this.carga = false;
    this._archivos.pushfile(file, data, "articulo")
      .subscribe(
        (data: any) => {
          // console.log('POST Request is successful ', data);
          if(data){
            this.data.foto = data;
            this.blur('foto');
            this.carga = true;
          }else{
            if(this.data.id){
              let
                init:any = 0
              ;
              const interval = setInterval(() => {
                // console.log(init);
                init+= 1;
                if(init === 3){
                  this.carga = true;
                  this.getGaleria();
                  this.stopConter(interval);
                }
              }, 1000);
            }
          }
        },
        (error: any) => {
          console.log('Error', error);
          this.carga = true;
          swal('Error!', 'Error al subir la imagen', 'error');
        }
      );
  }
  stopConter(interval: any) {
    clearInterval(interval);
  }
  deletefile(obj: any) {
    if (obj) {
      const
        url:any = _.split(obj.foto, '/', 10)
      ;
      const
        query = {
          name : url[3],
          archivo: obj
        }
      ;
      // console.log(query);
      this._archivos.deletefile(query)
      .subscribe(
        data => {
          console.log(data);
          if(data.status = 200){
            this.getGaleria();
          }
        }
      )
      ;
    }
  }


}
