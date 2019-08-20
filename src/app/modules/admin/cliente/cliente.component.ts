import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from './../../../services/usuarios.service';
import { RolService } from './../../../services/rol.service';
import { ToolsService } from './../../../services/tools.service';
import { FactoryModelService } from './../../../services/factory-model.service';
import * as _ from 'lodash';
import swal from 'sweetalert';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  public disable: boolean = false;
  public data: any = {};
  public list: any = [];
  public user: any = {};
  public count: any = 0;
  public searcht: any ={
    txt: ''
  };
  public query: any = {where:{}};
  clone:any = {};
  constructor(
    private _usuarios: UsuariosService,
    private _tools: ToolsService,
    private _rol: RolService,
    private route: ActivatedRoute,
    private router: Router,
    private _model: FactoryModelService,
  ) { }

  ngOnInit() {
    this.user = this._model.user;
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
            pageIndex: 10,
            pageSize: 0
          }
        ;
        this.getlist(null, paginate);
      }
    });
  }
  pageEvent(ev){
    // console.log(ev);
    ev.pageSize = 10;
    this.getlist(null, ev);
  }
  getsearh(){
    const
      paginate: any = {
        pageIndex: 10,
        pageSize: 0
      }
    ;
    if(this.searcht.txt){
      this.query.where.or = [
        {
          name:{
            contains: this.searcht.txt || ''
          }
        },
        {
          lastname:{
            contains: this.searcht.txt || ''
          }
        },
        {
          celular: {
            contains: this.searcht.txt || ''
          }
        },
        {
          sexo:{
            contains: this.searcht.txt || ''
          }
        },
        {
          email:{
            contains: this.searcht.txt || ''
          }
        },
        {
          documento:{
            contains: this.searcht.txt || ''
          }
        },
        {
          ciudad:{
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
    this.query.where.empresa = this.user.empresa;
    this.query.where.estado = "activo";
    this.query.limit = paginate.pageIndex;
    this.query.skip = paginate.pageSize;

    if(this.user.rol.nombre === "super admin"){
      delete this.query.where.empresa;
    }
    if(obj){
      this.query.where.id = obj;
      this.query.limit = 1;
    }
    this._usuarios.get(this.query)
    .subscribe(
      (res: any)=>{
        // console.log(res);
        this.count = res.count;
        if(obj){
          this.open(res.data[0]);
        }else{
          this.list = _.unionBy(this.list || [], res.data, 'id');
        }
      }
    )
    ;
  }
  open(obj: any){
    this.disable =!this.disable;
    if(obj){
      this.data = obj;
      this.clone = _.clone(obj);
    }else{
      this.data = {
        empresa: this.user.empresa
      }
      ;
      this.router.navigate(['admin/clientes']);
      this.rol();
    }
  }
  rol(){
    return this._rol.get({
      nombre: 'usuario'
    })
    .subscribe(
      (rta: any)=>{
        console.log(rta);
        if(!rta){
          return this._rol.saved({
            nombre: 'usuarios',
            descripcion: 'rol de usuarios'
          })
          .subscribe(
            (rta: any)=>{
              console.log(rta);
              if(rta){
                this.data.rol = rta.id;
              }
            }
          )
        }
        this.data.rol = rta.id;
      }
    )
    ;
  }
  saved(){
    const
      data: any = this.data
    ;
    if(data.name){
      data.slug = _.kebabCase(data.name)
      return this._usuarios.saved(data)
      .subscribe(
        (res: any) => {
          // console.log(res);
          if(res){
            this.data = {
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
    if(this.data.id && this.data[obj] !== this.clone[obj]){
      var
        data: any = {
          id: this.data.id
        }
      ;
      data[obj]=this.data[obj];
      // console.log(data);
      return this._usuarios.edit(data)
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
  delete(obj:any, idx){
    // console.log(obj, idx);
    if(obj){
      return this._usuarios.edit({
        id: obj.id,
        estado: "inactivo"
      })
      .subscribe(
        (res: any)=>{
          if(res){
            this.list.splice(idx, 1);
            swal("Completado!", "Eliminado Correctamente!", "success");
          }
        }
      )
      ;
    }
  }




}
