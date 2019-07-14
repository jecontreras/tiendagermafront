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
      query: any ={
        where:{
          // empresa: 1
        }
      }
    ;
    this._cart.get(query)
    .subscribe(
      (res: any)=>{
        console.log(res.data);
        this.list = _.unionBy(this.list || [], res.data, 'id');
      }
    )
    ;
  }

  add(data: any){
    this.disable = !this.disable;
    if(data){
      this.clone = _.clone(data);
      this.data = data;
    }else{
      this.clone = {};
      this.data = {
        empresa: this.user.empresa,
        pago: {},
        user: {}
      };
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
  blur(opt: string){
    // console.log(opt, this.clone, this.data);
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
