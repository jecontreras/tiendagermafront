import { Component, OnInit } from '@angular/core';
import { ProductoService } from './../../../services/producto';
import { ToolsService } from './../../../services/tools.service';
import { CategoriasService } from './../../../services/categorias';
import { TallaService } from './../../../services/talla.service';
import { ColoresService } from './../../../services/colores.service';
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
  cuerpo: any = {};
  constructor(
    private _producto: ProductoService,
    private _categoria: CategoriasService,
    private _talla: TallaService,
    private _color: ColoresService,
    private _tools: ToolsService
  ) {
    this.cuerpo = _producto;
  }

  ngOnInit() {
    const
      data:any = {
        where:{
          // empresa:
        }
      }
    ;
    this._producto.get(data)
    .subscribe(
      (res: any) =>{
        // console.log(res.data);
        this.list = _.unionBy(this.list || [], res.data, 'id');
      }
    )
  }
  add(opt){
    // console.log(opt);
      this.disable = !this.disable;
      if(opt){
        this.data = opt;
      }else{
        this.data = {
          codigo: this.codigo(),
          empresa: 1
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
        categoriaDe: ['etiqueta', 'articulo'],
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
        // categoriaDe: 'marca'
        empresa: 1
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
        // categoriaDe: 'marca'
        empresa: 1
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
              empresa: 1
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
  datafiles(ev) {
    this.datafile = ev.target.files;
    // console.log(this.datafile);
  }
  file() {
    if (this.img && this.data.id) {
      const
        _producto = this._producto,
        file = this.datafile
      ;
      // console.log(file);
      _producto.pushfile(file)
      .subscribe(
        data => {
            console.log('POST Request is successful ', data);
            if (data[0]) {
              const urllogo = _.split(data[0].fd, 'images', 10);
              // cuerpo._tools.openSnack('Agregado Foto de Perfil', false);
              // console.log(cuerpo.data, urllogo);
              // deletefile(cuerpo, _perfil);
              this.data.foto = GLOBAL.url + 'images' + urllogo[1];
              // console.log(cuerpo.data.foto);
              this.blur('foto');
              this.deletefile();
            }
        },
        error => {
            console.log('Error', error);
        }
      );
    }
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
