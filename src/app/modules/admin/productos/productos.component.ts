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
import * as XLSX from 'xlsx';
type AOA = any[][];

@Component({
  selector: 'productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  public disable:boolean = false;
  data:any = {};
  excel: any = [];
  clone:any = {};
  img: any = [];
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
  public search: any;
  public listetiqueta: any = [];
  public multiple: boolean = false;
  public disabledexcel: boolean = false;
  public listgroup: any = [];

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
    this.listgroup = [
      {
        codigo: this.codigo(),
        empresa: this.user.empresa
      }
    ]

  }
  genrarexcel(){
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.excel);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }
  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.excel = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
      console.log(this.excel);
      var
        datas = [],
        format = {}
      ;
      // _.forEach(this.excel, function(item, idx){
      //   _.forEach(item, function(val, key){
      //     if(idx === 0){
      //       format[val]='';
      //     }else{
      //
      //     }
      //   })
      //   ;
      // })
      // ;
      console.log(format);
    };
    reader.readAsBinaryString(target.files[0]);
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
    // console.log(data);
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
        this.buscaretiquete();
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
  public uploadData(event: any) : void {
    // get data from file upload
      let filesData = event.target.files;
      console.log(filesData[0]);
  }
  saved(){
    var
      data: any = this.data,
      _producto: any = this._producto,
      list: any = this.list,
      disable: any = this.disable
    ;
    if(this.multiple){
      data = this.listgroup;
    }else{
      data = [data];
    }
    _.forEach(data, function(item, idx){
      if(item.titulo){
        item.slug = _.kebabCase(item.titulo);
        if(item.costopromosion){
          item.porcentajedes = item.costopromosion * 100 / item.costoventa;
        }
        return _producto.saved(item)
        .subscribe(
          (res: any) => {
            // console.log(res);
            if(res){
              // this.data = {
              //   codigo: this.codigo(),
              //   empresa: this.user.empresa
              // };
              item.id = res.id;
              list.push(item);
              if(idx+1 >= data.length){
                disable = false;
                swal("Completado!", "Agregado Correctamente!", "success");
              }
            }else{
              swal("Fallo!", "Error al Agregar!", "error");
            }
          }
        )
        ;
      }
    })
    ;
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
      if(obj === "costopromosion" || obj === "costoventa"){
        data.porcentajedes = this.data.costopromosion * 100 / this.data.costoventa;
      }
      console.log(data);
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

  clickmultiple(){
    this.listgroup.push(
      {
        codigo: this.codigo(),
        empresa: this.user.empresa
      }
    );
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
        (data: any) => {
          // console.log(data);
          if(data.status = 200){
            this.getGaleria();
          }
        }
      )
      ;
    }
  }

  buscaretiquete(){
    const
      data: any = this.search,
      query: any = {
        where:{
          categoriaDe: "producto"
        },
        limit: 20
      }
    ;
    if(data){
      query.where.categoria = data;
    }
    // console.log(query);
    return this._categoria.get(query)
    .subscribe(
      (res: any)=>{
        // console.log(res);
        res = res.data;
        this.listetiqueta = res;
        if(!data){
          this.getCategoriaArticulo();
        }
      }
    )
    ;
  }
  getCategoriaArticulo(){
    return this._categoria.articuloCategoriaget({
      where:{
        articulo: this.data.id,
        categoria: {
          '!': null
        }
      }
    })
    .subscribe(
      (res: any)=>{
        // console.log(res);
        res = res.data;
        for (var i = 0; i < res.length; i++) {
          const
            idx: any = _.findIndex(this.listetiqueta, ['id', res[i].categoria.id])
          ;
          // console.log(idx);
          if(idx >- 1){
            this.listetiqueta[idx].ids = res[i].id;
            this.listetiqueta[idx].check = true;
          }else{
            res.categoria.ids = res[i].id;
            this.listetiqueta.unshift(res[i].categoria);
          }
        }
      }
    )
    ;
  }
  crearetiqueta(){
    const
      query: any = {
        categoria: this.search,
        empresa: this.user.empresa,
        slug: _.kebabCase(this.search),
        categoriaDe: "producto"
      }
    ;
    // console.log(query);
    return this._categoria.saved(query)
    .subscribe(
      (rta: any)=>{
        console.log(rta);
        if(rta){
          this.etiquetaAdd(rta);
          this.search='';
          this.buscaretiquete();
        }
      }
    )
    ;
  }
  etiquetaAdd(obj: any){
    const
      query : any = {
        articulo: this.data.id,
        categoria: obj.id
      }
    ;
    if(query.articulo){
      return this._categoria.articuloCategoria(query)
      .subscribe(
        (res: any)=>{
          // console.log(res);
          if(res){
            this._tools.openSnack('Asignado', '', false);
            obj.check = true;
            obj.ids = res.id;
          }
        }
      )
      ;
    }else{
      this._tools.openSnack('Error en los Datos ', '', false);
    }
  }
  etiquetaDelete(obj: any){
    const
      query:any = {
        id: obj.ids
      }
    ;
    if(query.id){
      return this._categoria.articuloCategoriadelete(query)
      .subscribe(
        (res: any)=>{
          // console.log(res);
          if(res){
            this._tools.openSnack('Eliminado', '', false);
            obj.check = false;
            delete obj.ids;
          }else{
            this._tools.openSnack('Error', '', false);
          }
        }
      )
      ;
    }
  }


}
