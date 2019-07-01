import { Component, OnInit } from '@angular/core';
import { paises } from './../../../../json/paises'
import { CartService } from './../../../../services/cart.service';
import { UsuariosService } from './../../../../services/usuarios.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['/checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public data: any = {};
  public listpaises: any = [];
  constructor(
    private _cart: CartService,
    private _user: UsuariosService
  ) {

  }
  ngOnInit(){
    this.listpaises = paises;
    const
      shop: any = JSON.parse(localStorage.getItem('shop'))
    ;
    this.data = shop;
    console.log(shop);
  }

  submidOrden(){
    const
      data: any = this.data
    ;
    console.log(data);
    if(data){
      return this._cart.generate(data)
      .subscribe(
        (res: any)=>{
          console.log(res);
        }
      )
      ;
    }
  }
}
