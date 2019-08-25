import { Component, OnInit } from '@angular/core';
import { ProductoService } from './../../../services/producto';
import { ToolsService } from './../../../services/tools.service';
import { CategoriasService } from './../../../services/categorias';
import { TallaService } from './../../../services/talla.service';
import { ColoresService } from './../../../services/colores.service';
import { FactoryModelService } from './../../../services/factory-model.service';
import { ArchivoService } from './../../../services/archivo.service';
import { MercadoService } from './../../../services/mercados.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
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
  data:any = {
    tallas:{},
    colores: {},
    listacolores: [],
    listatallas: []
  };
  excel: any = [];
  clone:any = {};
  img: any = [];
  list:any = [];
  public count: any = 0;
  datafile: any = {};
  public global  =  GLOBAL;
  public listcategoria: any = [];
  public listmarca: any = [];
  public listcolor: any = [];
  public listtalla: any = [];
  public listgaleria: any = [];
  public user: any = {empresas:{}};
  public carga: boolean= true;
  cuerpo: any = {};
  public search: any;
  public listetiqueta: any = [];
  public multiple: boolean = false;
  public disabledexcel: boolean = false;
  public listgroup: any = [];
  public searcht: any ={
    txt: ''
  };
  public query: any = {where:{}};
  public listmercados: any = [];
  public disabledinit: any = false;

  config: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: '300px',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _model: FactoryModelService,
    private _producto: ProductoService,
    private _categoria: CategoriasService,
    private _archivos: ArchivoService,
    private _talla: TallaService,
    private _color: ColoresService,
    private _mercados: MercadoService,
    private _tools: ToolsService
  ) {
    this.cuerpo = _producto;
    this.user = this._model.user;
    this.user.empresas = {};
    // console.log(this.user);
    this.getEmpresa();
    this.getmercados();
  }

  ngOnInit() {
    if(this._model.user.rol.nombre !== "super admin" && this._model.user.rol.nombre !== "admin"){
      this.router.navigate(['admin/dashboard']);
    }
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
    this.listgroup = [
      {
        codigo: this.codigo(),
        tallas: {},
        colores: {},
        listatallas:[],
        listacolores: [],
        empresa: this.user.empresa
      }
    ]

  }
  disableeye(){
    // console.log(this.disabledinit);
    this.disabledinit === 'true' ?this.disabledinit=true : this.disabledinit=false;
  }
  pageEvent(ev){
    // console.log(ev);
    ev.pageSize = 10;
    // ev.pageSize= ev.pageSize*ev.pageIndex;
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
    this.query.where.empresa = this.user.empresa;
    this.query.sort ='createdAt DESC';
    this.query.limit = paginate.pageSize;
    this.query.skip = paginate.pageIndex;

    if(this.user.rol.nombre === "super admin"){
      delete this.query.where.empresa;
    }
    if(obj){
      this.query.where.id = obj;
      this.query.limit = 1;
    }
    console.log(this.query);
    this._producto.get(this.query)
    .subscribe(
      (res: any) =>{
        console.log(res.data);
        if(obj){
          this.add(res.data[0]);
        }else{
          this.count = res.count;
          this.list = _.unionBy(this.list || [], res.data, 'id');
        }
      }
    );
  }
  getEmpresa(){
    return this._model.query("empresa",{
      where:{
        id: this.user.empresa.id
      },
      limit: 1
    })
    .subscribe(
      (res: any)=>{
        // console.log(res);
        res = res.data[0];
        if(res){
          this.user.empresas = res;
        }
      }
    )
    ;
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
  add(opt){
    // console.log(opt);
      this.disable = !this.disable;
      if(opt){
        if(!opt.listatallas){
          opt.listatallas = [];
        }
        if(!opt.listacolores){
          opt.listacolores = [];
        }
        if(!opt.listapromosion){
          opt.listapromosion = [];
        }
        opt.tallas = {};
        opt.colores = {};
        this.clone = _.clone(opt);
        this.data = opt;
        // console.log(this.data);
        this.getGaleria();
        this.buscaretiquete();
        this.populatelist();
      }else{
        this.clone = {};
        this.data = {
          codigo: this.codigo(),
          tallas:{},
          colores: {},
          empresa: this.user.empresa,
          listacolores: [],
          listatallas: [],
          tipoproduct: 'producto',
          tipomercado: "5d62232e0f01230017379c9b",
          categorias: "5d6221c20f01230017379c99",
          marca: "5d6221ca0f01230017379c9a",
          estado: 'nuevo',
          opcion: 'activo',
          cantidad: 1,
          stock: 1,
          peso: 1,
          alto: 1,
          largo: 1,
          ancho: 1,
          costocompra: 0,
          listapromosion: []
        }
        ;
        this.router.navigate(['admin/productos']);
      }
      this.categorias();
  }
  populatelist(){
    if(this.data.listatallas){
      if(this.data.listacolores.length){
        this.data.colores.color = "varias";
      }
    }
    if(this.data.listatallas){
      if(this.data.listatallas.length){
        this.data.tallas.talla = "varias";
      }
    }
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
        //  console.log(res);
         this.listcategoria = res.data;
         this.marcas();
       }
     )
     ;
  }
  getmercados(){
    return this._mercados.get({where:{}, limit: -1})
    .subscribe(
      (res: any)=>{
        // console.log(res)
        res = res.data;
        this.listmercados = res;
      }
    );
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
        //  console.log(res);
         this.listmarca = res.data;
         this.talla(null);
       }
     )
     ;
  }
  talla(data: any){
    // console.log(this._talla);
    var
      query = {}
    ;
    if(data){
      query = {
        id: data.color
      }
    }
    return this._talla.get({
      where: query,
      limit: -1
     })
     .subscribe(
       (res: any)=>{
         // console.log(res);
         if(!data){
           this.listtalla = res.data;
           this.color(null);
         }else{
           data.color = res.data[0];
         }
       }
     )
     ;
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
      where: query,
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
    _.forEach(data, (item, idx)=>{
      if(item.titulo && item.empresa && item.tipoproduct && item.marca && item.categorias
        && item.alto && item.largo && item.ancho){
        item.slug = _.kebabCase(item.titulo);
        if(item.costopromosion){
          item.porcentajedes = item.costopromosion * 100 / item.costoventa;
        }
        if(item.talla === 'None'){
          delete item.talla;
        }
        if(item.color === 'None'){
          delete item.color;
        }
        // console.log(item);
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
                this.router.navigate(['admin/productos', item.id]);
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
  blur(obj: any, opt: boolean){
    // console.log(this.data);
    // console.log(obj);
    if(obj === "talla"){
      const
        idx:any = _.findIndex(this.listtalla, ['id', this.data.talla])
      ;
      if(idx >-1){
        this.data.tallas = this.listtalla[idx];
      }else{
        this.data.tallas = {};
        this.data.listatallas = [];
      }
    }
    if(obj === "color"){
      const
        idx:any = _.findIndex(this.listcolor, ['id', this.data.color])
      ;
      if(idx >-1){
        this.data.colores = this.listcolor[idx];
      }else{
        this.data.colores = {};
        this.data.listacolores = [];
      }
    }

    if(this.data.id && this.data[obj] !== this.clone[obj] || opt){
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

  clickmultiple(){
    this.listgroup.push(
      {
        codigo: this.codigo(),
        tallas: {},
        colores: {},
        empresa: this.user.empresa,
        listacolores: [],
        listatallas:[],
      }
    );
    // console.log(this.listgroup);
  }
  estadolist(obj: any, item: any){
    console.log(item);
    if(obj === "talla"){
      const
        idx:any = _.findIndex(this.listtalla, ['id', item.talla])
      ;
      if(idx >-1){
        item.tallas = this.listtalla[idx];
      }else{
        item.tallas = {};
        item.listatallas = [];
      }
    }
    if(obj === "color"){
      const
        idx:any = _.findIndex(this.listcolor, ['id', item.color])
      ;
      if(idx >-1){
        item.colores = this.listcolor[idx];
      }else{
        item.colores = {};
        item.listacolores = [];
      }
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
        (res: any) => {
          // console.log('POST Request is successful ', res, data);
          this.carga = true;
          if(res){
            if(!data){
              this.data.foto = res;
              // this.data.infodrive1 = data
              this.blur('foto', false);
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
          }else{
            swal('Error!', 'Error al subir la imagen', 'error');
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
      query.where.categoria = {
        contains: data
      };
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
          // console.log(res);
          if(idx >- 1){
            this.listetiqueta[idx].ids = res[i].id;
            this.listetiqueta[idx].check = true;
          }else{
            res[i].categoria.ids = res[i].id;
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
