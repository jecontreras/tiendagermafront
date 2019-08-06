import { Component, OnInit } from '@angular/core';
import { FactoryModelService } from './../../../../services/factory-model.service';
import { ProductoService } from './../../../../services/producto';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss']
})
export class ContenidoComponent implements OnInit {
  public listproductpres: any = [];
  constructor(
    private _model: FactoryModelService,
    private _producto: ProductoService
  ) {
    this.getproduct();
  }
  ngOnInit(){

  }
  getproduct(){
    return this._producto.get({
      where:{
        opcion: "activo"
      },
      limit: 12
    })
    .subscribe(
      (res: any)=>{
        // console.log(res);
        res = res.data;
        this.listproductpres = res;
      }
    )
    ;
  }
}
