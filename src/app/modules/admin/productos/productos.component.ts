import { Component, OnInit } from '@angular/core';
import { ProductoService } from './../../../services/producto';
import { ToolsService } from './../../../services/tools.service';
import * as _ from 'lodash';
import { GLOBAL } from './../../../services/global';

@Component({
  selector: 'productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  disable:any = false;
  data:any = {};
  img: any = {};
  list:any = {};
  datafile: any = {};
  public global  =  GLOBAL;
  cuerpo: any = {};
  constructor(
    private _producto: ProductoService,
    private _tools: ToolsService
  ) {
    this.cuerpo = _producto;
  }

  ngOnInit() {
    const
      data:any = {}
    ;
    this._producto.get(data)
    .subscribe(
      (res) =>{
        console.log(res);
        this.list = res;
      }
    )
  }
  add(opt){
      this.disable = !this.disable;
      if(opt){
        this.data = opt;
      }else{
        this.data = {};
      }
  }
  saved(){
    const
      data: any = this.data
    ;
    this._producto.saved(data)
    .subscribe(
      (res: any) => {
        // console.log(res);
      }
    )
    ;
  }
  edit(obj){
    if(this.data.id){
      var
        data: any = {
          id: this.data.id
        }
      ;
      data[obj]=this.data[obj];
      this._producto.edit(data)
      .subscribe(
        (res: any)=> {
          // console.log(res);
          this._tools.openSnack('Actualizado '+obj, '', false);
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
              this.edit('foto');
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
