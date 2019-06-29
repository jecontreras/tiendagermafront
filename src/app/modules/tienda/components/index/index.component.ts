import { Component, OnInit } from '@angular/core';
import { ToolsService } from './../../../../services/tools.service';
import { CategoriasService } from './../../../../services/categorias';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['/index.component.scss']
})
export class IndexComponent implements OnInit {
  public listcategorias:any = [];
  constructor(
    private _tools: ToolsService,
    private _categoria: CategoriasService
  ) {

  }
  ngOnInit(){
    this.getlist();
  }
  getlist(){
    this._categoria.get({
      where:{
        categoriaDe: 'Articulo'
      }
    })
    .subscribe(
      (rta: any)=>{
        rta = rta.data;
        console.log(rta);
        this.listcategorias = rta;
      }
    )
    ;
  }
}
