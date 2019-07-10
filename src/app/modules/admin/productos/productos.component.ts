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
  img: any = {};
  list:any = [];
  datafile: any = {};
  public global  =  GLOBAL;
  public listcategoria: any = [];
  public listmarca: any = [];
  public listcolor: any = [];
  public listtalla: any = [];
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
    this.getlist();
  }
  getlist(){
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
    this._producto.get(data)
    .subscribe(
      (res: any) =>{
        // console.log(res.data);
        this.list = _.unionBy(this.list || [], res.data, 'id');
      }
    );
  }
  add(opt){
    // console.log(opt);
      this.disable = !this.disable;
      if(opt){
        this.data = opt;
      }else{
        this.data = {
          codigo: this.codigo(),
          empresa: this.user.empresa
        }
        ;
      }
      this.categorias();
  }
  codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
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
    if(this.data.id){
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
  file() {
    // if(this.img){
    const
      file = this.datafile
      ;
    // console.log(file);
    this.carga = false;
    this._archivos.pushfile(file)
      .subscribe(
        (data: any) => {
          console.log('POST Request is successful ', data);
          if(data[0]){
            const
              url:any = _.split(data[0].fd,"images", 10)
            ;
            console.log(url);
            this.data.foto = this._model.url+"images"+url[1];
            this.blur('foto');
          }
          this.carga = true;
        },
        (error: any) => {
          console.log('Error', error);
          this.carga = true;
          swal('Error!', 'Error al subir la imagen', 'error');
        }
      );
  }
  deletefile() {
    if (this.data.foto) {
      const
        urldelete = _.split(this.data.foto, '/', 10)
      ;
      this._producto.deletefile(urldelete[3])
      .subscribe(
        data => {
          // console.log(data);
        }
      )
      ;
    }
  }


}
