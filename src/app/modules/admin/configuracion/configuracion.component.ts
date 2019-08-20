import { Component, OnInit } from '@angular/core';
import { ColoresService } from './../../../services/colores.service';
import { ToolsService } from './../../../services/tools.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GLOBAL } from './../../../services/global';
import { FactoryModelService } from './../../../services/factory-model.service';
import { ArchivoService } from './../../../services/archivo.service';
import { ConfiguracionService } from './../../../services/configuracion.service';
import * as _ from 'lodash';
import swal from 'sweetalert';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  public disable: boolean = false;
  public data: any = {};
  public clone: any = [];
  public user: any = {};
  public carga: boolean= true;
  public datafile: any;
  public img: any;

  constructor(
    private _colores: ColoresService,
    private _tools: ToolsService,
    private _archivos: ArchivoService,
    private route: ActivatedRoute,
    private router: Router,
    private _configuracion: ConfiguracionService,
    private _model: FactoryModelService,
  ) {
    this.getinit();
    this._model.loadapp();
   }

  ngOnInit() {
    this.user = this._model.user;
    if(this._model.user.rol.nombre !== "super admin"){
      this.router.navigate(['admin/dashboard']);
    }
  }
  getinit(){
    // console.log(this._model.app);
    this.data = this._model.app;
  }
  datafiles(ev: any) {
    this.datafile = ev.target.files;
    // console.log(this.datafile);
  }
  file(opt: any) {
    // if(this.img){
    const
      file = this.datafile
      ;
    // console.log(file);
    this.carga = false;
    this._archivos.pushfile(file, false, "app")
      .subscribe(
        (data: any) => {
          // console.log('POST Request is successful ', data);
          if(data){
            this.data[opt] = data;
            this.blur(opt)
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
  blur(opt: string){
    // console.log(opt, this.clone, this.data);
    if(this.data.id){
      if(this.data[opt] !== this.clone[opt]){
        const
          query : any = {
            id: this.data.id
          }
          ;
          query[opt] = this.data[opt];
          if(query.id){
            this._configuracion.edit(query)
            .subscribe(
              (res: any)=>{
                // console.log(res);
                if(res){
                  localStorage.removeItem('app');
                  localStorage.setItem('app', JSON.stringify(this.data));
                  this._model.app = this.data;
                  this._tools.openSnack('Actualizado '+opt, 'Ok', false);
                }
              }
            )
            ;
          }
      }
    }
  }

}
