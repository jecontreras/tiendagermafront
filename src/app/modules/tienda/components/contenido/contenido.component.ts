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
  public disableindex: boolean = false;
  public app: any = {};

  constructor(
    private _model: FactoryModelService,
    private _producto: ProductoService
  ) {
    this.getproduct();
    console.log(this._model.app);
    this.app = this._model.app;
    // if(!this._model.app.portada1){
    //   this.app = {
    //     portada1: './assets/img/productnew2.png',
    //     portada2: './assets/img/tecnologia.jpg',
    //     portada3: './assets/img/computadores.png',
    //     portada4: './assets/img/gamer.jpg',
    //     portada5: './assets/img/descuentos.png'
    //   };
    // }else{
    //   this.app = this._model.app;
    // }
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
        this.disableindex = !this.disableindex;
        res = res.data;
        this.listproductpres = res;
      }
    )
    ;
  }
}
