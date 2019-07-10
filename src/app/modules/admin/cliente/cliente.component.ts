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
    this.getlist();
  }
  getlist(){
    const
      query:any = {
        where:{
          empresa: this.user.empresa
        },
        limit: 10
      }
    ;
    if(this.user.rol.nombre === "super admin"){
      delete query.where.empresa;
    }
    this._usuarios.get({})
    .subscribe(
      (res: any)=>{
        console.log(res);
        this.list = _.unionBy(this.list || [], res.data, 'id');
      }
    )
    ;
  }
  open(obj: any){
    this.disable =!this.disable;
    if(obj){
      this.data = obj;
    }else{
      this.data = {
        empresa: this.user.empresa
      }
      ;
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
      this._usuarios.saved(data)
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
    if(this.data.id){
      var
        data: any = {
          id: this.data.id
        }
      ;
      data[obj]=this.data[obj];
      // console.log(data);
      this._usuarios.edit(data)
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




}
