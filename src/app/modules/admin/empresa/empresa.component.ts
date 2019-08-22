import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TiendasService } from './../../../services/tiendas.service';
import { MercadoService } from './../../../services/mercados.service';
import { UsuariosService } from './../../../services/usuarios.service';
import { ToolsService } from './../../../services/tools.service';
import { ArchivoService } from './../../../services/archivo.service';
import { FactoryModelService } from './../../../services/factory-model.service';
import * as _ from 'lodash';
import swal from 'sweetalert';
import { GLOBAL } from './../../../services/global';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {

  public disable: boolean = false;
  public data: any = {};
  public list: any = [];
  public clone: any = [];
  public listmercados: any = [];
  public user: any = {};
  public img: any = [];
  public datafile: any;
  public carga: boolean= true;
  public count: any = 0;
  public searcht: any ={
    txt: ''
  };
  public query: any = {where:{}};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _model: FactoryModelService,
    private _archivos: ArchivoService,
    private _tiendas: TiendasService,
    private _mercados: MercadoService,
    private _user: UsuariosService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    // console.log(this._model.user);
    if(this._model.user.rol.nombre !== "super admin"){
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
  }
  pageEvent(ev){
    // console.log(ev);
    ev.pageSize = 10;
    this.getlist(null,ev);
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
          empresa:{
            contains: this.searcht.txt || ''
          }
        },
        {
          url:{
            contains: this.searcht.txt || ''
          }
        },
        {
          ofrece:{
            contains: this.searcht.txt || ''
          }
        },
        {
          codigo:{
            contains: this.searcht.txt || ''
          }
        },
        {
          estado:{
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
    this.query.limit = paginate.pageSize;
    this.query.skip = paginate.pageIndex;

    if(obj){
      this.query.where.id = obj;
      this.query.limit = 1;
    }
    this._tiendas.get(this.query)
    .subscribe(
      (res: any)=>{
        // console.log(res.data);
        res = res.data;
        if(obj){
          this.add(res[0]);
        }else{
          this.list = _.unionBy(this.list || [], res, 'id');
        }
      }
    )
    ;
  }

  add(data: any){
    this.disable = !this.disable;
    if(data){
      this.clone = _.clone(data);
      this.data = data;
      this.getmercados();
      this.getuser();
    }else{
      this.clone = {};
      this.data = {
        codigo: this.codigo()
      };
      this.router.navigate(['admin/empresa']);
    }
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
    this._archivos.pushfile(file, false, "empresa")
      .subscribe(
        (data: any) => {
          // console.log('POST Request is successful ', data);
          if(data){
            this.data.foto = data;
            this.blur('foto')
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
  codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }
  getuser(){
    return this._user.get({
      where:{
        empresa: this.data.id,
        rol: "admin"
      }
    })
    .subscribe(
      (res: any)=>{
        // console.log(res);
        res = res.data[0];
        if(res){
          this.user = res;
        }
      }
    )
    ;
  }
  getmercados(){
    return this._mercados.get({
      where:{},
      limit: -1
    })
    .subscribe(
      (res: any)=>{
        // console.log(res);
        res = res.data;
        const
          _mercados: any = this._mercados,
          data: any = this.data
        ;
        _.forEach(res, function(item){
          return _mercados.getMercado({
            empresa: data.id,
            mercados: item.id
          })
          .subscribe(
            (rta: any)=>{
              // console.log(rta);
              rta = rta.data[0];
              if(rta){
                item.check = true;
                item.ids = rta.id;
              }
            }
          )
          ;
        })
        ;
        // console.log(res);
        this.listmercados = res;
      }
    )
    ;
  }
  savedmercado(obj: any){
    if(obj && !obj.check){
      return this._mercados.savedMercado({
        empresa: this.data.id,
        mercados: obj.id
      })
      .subscribe(
        (res: any)=>{
          // console.log(res);
          if(res){
            obj.check = true;
            this._tools.openSnack('Agregado '+obj.titulo, '', false);
          }
        }
      )
      ;
    }else{
      console.log(obj);
      if(obj.ids){
        return this._mercados.deleteMercado({
          id: obj.ids
        })
        .subscribe(
          (res: any)=>{
            console.log(res);
            if(res)this._tools.openSnack('Eliminado '+obj.titulo, '', false)
            obj.check = !obj.check;
            delete obj.ids;
            return res;
          }
       );
      }
   }
  }
  saved(){
    const
      query: any = this.data
    ;
    if(query.empresa){
      query.slug = _.kebabCase(query.empresa)
      // console.log(query);
      this._tiendas.saved(query)
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
          this._tiendas.edit(query)
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

  usersaved(){
    var
      user: any = this.user;
    ;
    if(user.email && user.username && user.password){
      user.name = user.lastname;
      user.empresa = this.data.id;
      user.rol = "admin";
      user.confirpassword = user.password;

      return this._user.saved(user)
      .subscribe(
        (res: any)=>{
          // console.log(res);
          res = res.data;
          if(res){
            this._tools.openSnack('Registrado '+res.username, 'Ok', false);
          }else{
            this._tools.openSnack('Error al Registrar ', 'Ok', false);
          }
        }
      )
    }
  }

}
