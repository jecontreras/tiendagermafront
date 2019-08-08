import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolsService } from './../../../../services/tools.service';
import { FactoryModelService } from './../../../../services/factory-model.service';
import { ProductoService } from './../../../../services/producto';
import { CategoriasService } from './../../../../services/categorias';
import { ComentarioService } from './../../../../services/comentario.service';
import { departamento } from '../../../../Json/departamentos';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NgImageSliderComponent } from 'ng-image-slider';
import swal from 'sweetalert';
@Component({
  selector: 'app-singleproductdetails',
  templateUrl: './singleproductdetails.component.html',
  styleUrls: ['./singleproductdetails.component.scss']
})
export class SingleproductdetailsComponent implements OnInit {
  @ViewChild('nav') ds: NgImageSliderComponent;
  public data: any = {
    listacolores: [],
    listatallas: [],
    empresa: {},
    color: {},
    talla: {}
  };
  public dato: any = {};
  public id: string;
  public disablediri: boolean;
  public listdepartamento: any = [];
  public comentario: any = {};
  public listciudades: any = [];
  public listresena: any = [];
  mySlideImages = [];
  public listacolores: any = [{}];
  public images: any;
  public imageObject: any;
  showSlider = true;
  sliderWidth: Number = 940;
  sliderImageWidth: Number = 300;
  sliderImageHeight: Number = 225;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = false;
  sliderImagePopup: Boolean = true;
  sliderAutoSlide: Boolean = false;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _producto: ProductoService,
    private _model: FactoryModelService,
    private _comentario: ComentarioService,
    private _categoria: CategoriasService,
    private _tools: ToolsService,
    private _sanitizer: DomSanitizer
  ) {
    this.listdepartamento = departamento;
    this.route.params.subscribe(params => {
      // console.log(params);
       if(params['id']!=null){
         this.id = params['id'];
        this.getlist(params['id']);
      }else{
        this.router.navigate(['../']);
      }
    });
  }
  ngOnInit(){
    this.blurcosto();
    // this.imageObject = [
    //    {
    //    	image: 'https://drive.google.com/file/d/1x76AQdRmgwDOYdsTCsrri9IvcOqV-YHJ/view?usp=drivesdk',
    //     thumbImage: 'https://lh3.googleusercontent.com/syp6fs8HPfAFHcJCtMf3atCH8eZlNRRjGZw6q_kYYVRoXHC3fD0AyGH1RQK0OTFGirN2PUdKdqs=s220',
    //     alt: 'Image alt'
    //    }
    // ];
    console.log(this.imageObject);
  }
  getlist(id:any){
    if(id){
      return this._producto.get({
        where:{
          slug: id
        }
      })
      .subscribe(
        (res: any)=>{
          // console.log(res);
          res = res.data[0];
          if(res){
            if(!res.listatallas){
              res.listatallas = [];
            }
            if(!res.listacolores){
              res.listacolores = [];
            }
            this.getmarca(res);
            res.codigofac = this.codigo();
            res.titulo = _.startCase(res.titulo);
            if(!res.color){
              res.color = {};
            }
            if(!res.talla){
              res.talla = {};
            }
            this.data = res;
            return this._producto.getGaleria({
              where:{
                articulo: res.id
              }
            })
            .subscribe(
              (res: any)=>{
                // console.log(res);
                res = res.data[0];
                var
                  img: any = [],
                  init: any = 1,
                  mySlideImages: any = [],
                  split: any = ""
                ;
                if(res){
                  _.forEach(res.archivos, function(item, val){
                    img.push({
                      image: item.foto64,
                      thumbImage: item.foto,
                      // alt
                    });
                  })
                  ;
                }
                // console.log(img);
                this.imageObject=img;
              }
            )
            ;
          }
        }
      )
      ;
    }else{
      this.router.navigate(['../']);
    }
  }
  imageOnClick(index) {
      console.log('index', index);
  }

  arrowOnClick(event) {
      console.log('arrow click event', event);
  }

  lightboxArrowClick(event) {
      console.log('popup arrow click', event);
  }

  prevImageClick() {
      this.ds.prev();
  }

  nextImageClick() {
      this.ds.next();
  }
  blurdepartamento() {
    // console.log(this.registerForm.value);
    const data: any = this.dato;
    let idx: any = 0;
    idx = _.findIndex(this.listdepartamento, ['departamento', data.departamento]);
    // console.log(idx);
    if (idx > -1) {
      // console.log(this.listdepartamento[idx]);
      this.listciudades = this.listdepartamento[idx].ciudades;
    }
  }
  blurcosto(){
    const
      dato: any = this.dato
    ;
    dato.costoenvio = dato.costoenvio || 8000;
    dato.fechaentrega = moment().add(20, 'days').format("DD/MM/YYYY");
    dato.fechamaxima = moment().add(40, 'days').format("DD/MM/YYYY");
    dato.ciudad = dato.ciudad || "Cúcuta";

  }
  getmarca(obj: any){
    return this._categoria.get({
      where:{
        categoriaDe: 'marca',
        id: obj.marca
        // empresa:
      },
      limit: 1
     })
     .subscribe(
       (res: any)=>{
         // console.log(res);
         this.getResena();
         res = res.data[0];
         if(res){
           obj.marca = res.categoria;
         }
       }
     )
     ;
  }
  agregar(obj: any){
    if(obj){
      const
        shop: any = JSON.parse(localStorage.getItem('articulos')) || []
      ;
      const
        idx: any = _.findIndex(articulo, ['codigofac', obj.codigofac])
      ;
      var
        query: any = {},
        articulo: any = []
      ;
      if(shop){
        articulo = shop.articulo || [];
      }

      // console.log(articulo)
      // console.log(idx);
      if (idx === -1) {
        obj.cantidadadquiridad = 1;
        if(this.dato.talla){
          obj.talla = this.dato.talla;
        }
        if(this.dato.color){
          obj.color = this.dato.color;
        }
        obj.costoenvio = 0;
        articulo.push(obj);
        query = {
          articulo: articulo,
          infextras: this.dato
        };
        // console.log(articulo);
        obj.check = true;
        localStorage.removeItem('articulos');
        localStorage.setItem('articulos', JSON.stringify(query));
      }
      swal({
        text: "Tu Producto se agregó al carrito!",
        icon: "warning",
        buttons: ["Seguir Comprando!", "IR AL CARRITO!"],
      })
      .then((willDelete) => {
        if (willDelete) {
          this.router.navigate(['tienda/checkout', 'ADBC']);
        } else {

        }
      });
    }
  }
  codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }
  resolved(ev: any){

  }
  getResena(){
    return this._comentario.get({
      where:{
        articulo: this.data.id
      }
    })
    .subscribe(
      (res: any)=>{
        // console.log(res);
        res = res.data;
        this.listresena = res;
      }
    )
    ;
  }
  evResena(){
    const
      query: any = {
        comentario: this.comentario.comentario,
        titulo : this.comentario.titulo,
        Califica: this.comentario.califica || 5,
        articulo: this.data.id,
        // user:
      }
    ;
    // console.log(this.comentario.califica);
    return this._comentario.saved(query)
    .subscribe(
      (res: any)=>{
        // console.log(res);
        if(res){
          this.listresena.push(res);
          this.comentario = {};
          this._tools.openSnack('Agregado Reseña ', '', false);
        }
      }
    )
    ;
  }
  blur(obj: any){
    // console.log(obj);
    if(obj){
      return this._producto.get({
        where:{
          slug: this.id
        },
        limit: 1
      })
      .subscribe(
        (res: any)=>{
          // console.log(res);
          res = res.data[0];
          if(res){
            const
              query: any = {
                id: res.id
              }
            ;
            query[obj]=1+res.megusta;
            return this._producto.edit(query)
            .subscribe(
              (rta: any)=>{
                // console.log(rta);
                if(rta){
                  this.data.megusta = rta.megusta;
                }
              }
            )
            ;
          }
        }
      )
      ;
    }
  }
}
