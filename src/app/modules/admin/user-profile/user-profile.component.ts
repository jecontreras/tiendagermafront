import { Component, OnInit } from '@angular/core';
import { FactoryModelService } from './../../../services/factory-model.service';
import { UsuariosService } from './../../../services/usuarios.service';
import { ToolsService } from './../../../services/tools.service';
import { ArchivoService } from './../../../services/archivo.service';
import * as _ from 'lodash';
import swal from 'sweetalert';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public data: any = {
    empresa: {},
    rol:{}
  };
  public clone: any = {};
  public img: any = [];
  public carga: boolean= true;
  public datafile: any;

  constructor(
    private _usuarios: UsuariosService,
    private _tools: ToolsService,
    private _archivos: ArchivoService,
    private _model: FactoryModelService,
  ) { }

  ngOnInit() {
    this.getperfil();
  }

  datafiles(ev: any) {
    this.datafile = ev.target.files;
    // console.log(this.datafile);
  }
  file() {
    // if(this.img){
    const
      file = this.datafile
      ;
    // console.log(file);
    this.carga = false;
    this._archivos.pushfile(file[0], false, "user")
      .subscribe(
        (data: any) => {
          // console.log('POST Request is successful ', data);
          if(data){
            this.data.foto = data;
            this.edit('foto')
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
  getperfil(){
    var
      query: any ={
        where: {
          id: this._model.user.empresa
        }
      }
    ;
    if(this._model.user.empresa.id){
      query = {
        where: {
          id: this._model.user.empresa.id
        }
      }
    }
    return this._model.query("empresa",query)
    .subscribe(
      (res: any)=>{
        // console.log(res, this._model.user);
        res = res.data[0];
        if(res){
          this._model.user.empresa = res;
        }else{
          this._model.user.empresa = {empresa: "none"};
        }
        this.data = this._model.user;
        this.clone = _.clone(this.data);
      }
    )
    ;
  }
  edit(obj: any){
    if(this.data[obj] !== this.clone[obj] && this.data.id){
      const
        data: any = {
          id: this.data.id
        }
      ;
      data[obj] = this.data[obj];
      if(obj === 'verifidcontrasena'){
        data.contrasena     = this.data.contrasena;
        data.passwordAfter  = this.data.passwordAfter;
      }
      return this._usuarios.edit(data)
      .subscribe(
        (res: any)=>{
          // console.log(res);
          if(res){
            this._model.user[obj] = res[obj];
            this._tools.openSnack('Actualizado '+obj, '', false);
          }
        }
      )
      ;
    }
  }

}
