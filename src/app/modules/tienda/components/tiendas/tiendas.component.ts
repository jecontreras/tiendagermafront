import { Component, OnInit } from '@angular/core';
import { ToolsService } from './../../../../services/tools.service';
import { TiendasService } from './../../../../services/tiendas.service';
import * as _ from 'lodash';
// import swal from 'sweetalert';
@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.component.html',
  styleUrls: ['/tiendas.component.scss']
})
export class TiendasComponent implements OnInit {

  public listtiendas: any = [];

  constructor(
    private _tools: ToolsService,
    private _tiendas: TiendasService
  ) {

  }
  ngOnInit(){
    this.get();
  }
  get(){
    this._tiendas.get({
      where:{
        estado: 'activo'
      },
      limit: 10
    })
    .subscribe(
      (res: any)=>{
        console.log(res);
        res = res.data;
        this.listtiendas = _.unionBy(this.listtiendas || [], res, 'id');
      }
    )
    ;
  }
}
