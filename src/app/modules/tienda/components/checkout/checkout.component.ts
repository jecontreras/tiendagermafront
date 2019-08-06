import { Component, OnInit } from '@angular/core';
import { paises } from './../../../../Json/paises'
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from './../../../../services/cart.service';
import { UsuariosService } from './../../../../services/usuarios.service';
import { FactoryModelService } from './../../../../services/factory-model.service';
import { departamento } from '../../../../Json/departamentos';
import * as _ from 'lodash';
import swal from 'sweetalert';
import * as sha from 'sha256';
declare var ePayco: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public data: any = {};
  public listpaises: any = [];
  public listdepartamento: any = [];
  public listciudades: any = [];
  public disabledemail = true;
  public nexbuild: boolean = false;
  public disablediri: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _model: FactoryModelService,
    private _cart: CartService,
    private _user: UsuariosService
  ) {
    this.getcart();
  }
  ngOnInit(){
    this.listpaises = paises;
    this.listdepartamento = departamento;
    // console.log(sha);
    // const
    //   shop: any = JSON.parse(localStorage.getItem('shop'))
    // ;
    // this.data = shop;
    // console.log(shop);
  }
  getcart(){
    const
      articulo: any = JSON.parse(localStorage.getItem('articulos')),
      entrega: string='free'
    ;
    var
      subtotal: any= 0,
      descuento: any= 0,
      cantidad: any = 0,
      total: any= 0,
      costoenvio: any =0
    ;
    // console.log(articulo);
    // this.listCart = articulo;
    _.forEach(articulo.articulo, function(item){
      costoenvio+=item.costoenvio;
      item.cantidadadquiridad = parseInt(item.cantidadadquiridad);
      cantidad+=item.cantidadadquiridad;
      if(item.costopromosion){
        subtotal+=parseInt(item.costopromosion)*parseInt(item.cantidadadquiridad);
        descuento+=parseInt(item.costoventa)-parseInt(item.costopromosion);
      }
      if(item.costoventa && !item.costopromosion){
        subtotal+=item.costoventa*parseInt(item.cantidadadquiridad);
      }
    })
    ;
    total = subtotal;
    this.data.codigo = this.codigo();
    this.data.cantidad = cantidad;
    this.data.subtotal = total;
    this.data.entrega = costoenvio;
    this.data.descuento = descuento;
    this.data.total = total;
    this.data.infextras = articulo.infextras;
    this.data.articulo = articulo.articulo;
    // console.log(this.data);
    return this._cart.validarart(this.data)
    .subscribe(
      (res: any)=>{
        // console.log(res);
        if(res.status === 200){
          res = res.data;
          this.data.articulo = res.articulo;
          this.data.subtotal = res.subtotal;
          this.data.entrega = res.entrega;
          this.data.descuento = res.descuento;
          this.data.total = res.total;
          this.data.infextras = res.infextras;
          localStorage.setItem('shop', JSON.stringify(this.data));
        }
      });
  }
  blurdepartamento() {
    // console.log(this.registerForm.value);
    const data: any = this.data.infextras;
    let idx: any = 0;
    idx = _.findIndex(this.listdepartamento, ['departamento', data.departamento]);
    // console.log(idx);
    if (idx > -1) {
      // console.log(this.listdepartamento[idx]);
      this.listciudades = this.listdepartamento[idx].ciudades;
    }
  }
  codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }
  validadEmail() {
    const
      data: any = this.data
      ;
    this.disabledemail = true;
    if (data.email) {
      const
        filtro: any = data.email.split('@', '2')
        ;
      // console.log(filtro);
      if (filtro[1] !== 'gmail.com') {
        this.disabledemail = false;
      }
    }
  }
  delearticulo(){
    this.data.subtotal = 0;
    this.data.descuento = 0;
    var
      costoenvio: any = 0
    ;
    _.forEach(this.data.articulo,(item: any) =>{
      // console.log(item);
      item.cantidadadquiridad = parseInt(item.cantidadadquiridad);
      costoenvio+=item.costoenvio;
      if(item.costopromosion){
        this.data.subtotal+=parseInt(item.costopromosion)*parseInt(item.cantidadadquiridad);
        this.data.descuento+= parseInt(item.costoventa)-parseInt(item.costopromosion);
      }
      if(item.costoventa && !item.costopromosion){
        this.data.subtotal+=parseInt(item.costoventa)*parseInt(item.cantidadadquiridad);
      }
    });
    this.data.entrega = costoenvio;
    this.data.total = this.data.subtotal;
    const
      query:any = this.data
    ;
    localStorage.removeItem('articulos');
    localStorage.setItem('articulos', JSON.stringify(query));
    this.data.total = this.data.subtotal + this.data.descuento +this.data.entrega;
  }
  submidOrden(){
    var
      data: any = this.data
    ;
    this.delearticulo();
    // console.log(data);
    if(data.terminocondicione && data.nombre && data.email
      && data.provivencia && data.ciudad && data.direccion1 && data.codigopostal
      && data.telefono){
      data.pais = data.gentilico || "colombiana";
      return this._cart.validarart(data)
      .subscribe(
        (res: any)=>{
          // console.log(res, data);
          if(res.status === 200){
            data.total = res.data.total;
            return this._cart.generate(data)
            .subscribe(
              (res: any)=>{
                // console.log(res);
                if(res.status === 200){
                  // this.router.navigate(['login', res.user]);
                  this.submitepayco();
                  if(!this._model.user){
                    swal("Correcto!", "Estimado Usuario Verificar tu Correo Electronico!", "success");
                  }
                }
              }
            )
            ;
          }
        }
      );

    }else{
      swal("Fallo!", "Error Por Favor Completar Campos Requeridos!", "error");
    }
  }
  submitepayco(){
    var
      data:any = {},
      descripcion:any = ""
    ;
    _.forEach(this.data.articulo, (item)=>{
      descripcion+=" " + item.titulo + " Codigo " + item.codigo;
    })
    ;
    data={
      //Parametros compra (obligatorio)
      // x_cust_id_cliente: this.codigo(),
      name: "Productos Entrega Completando",
      description: descripcion,
      invoice: this.data.codigo,
      currency: "cop",
      amount: this.data.total,
      tax_base: "0",
      tax: "0",
      country: "co",
      lang: "en",

      //Onpage="false" - Standard="true"
      external: "true",
      //Atributos opcionales
      extra1: "extra1",
      extra2: "extra2",
      extra3: "extra3",
      confirmation: "http://secure2.payco.co/prueba_curl.php",
      response: "http://secure2.payco.co/prueba_curl.php",

      //Atributos cliente
      name_billing: this.data.nombre,
      email_billing: this.data.email,
      address_billing: this.data.direccion1,
      type_doc_billing: "cc",
      mobilephone_billing: this.data.telefono,
      // number_doc_billing: "100000000",
      // x_key: this.codigo(),
      // x_currency_code: this.codigo(),
      // x_transaction_id: this.codigo(),
      // x_transaction_id: this.codigo()
    };
    // data.x_signature = sha(data.x_cust_id_cliente+data.x_key+data.x_ref_payco+data.x_transaction_id+data.x_amount+data.x_currency_code);
    // console.log(data);
    const handler: any = ePayco.checkout.configure({
      key: "90506d3b72d22b822f53b54dcf22dc3a",
      test: true
    });
    handler.open(data);
  }
}
