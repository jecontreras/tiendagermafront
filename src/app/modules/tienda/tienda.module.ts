import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { ComunidadComponent } from './components/comunidad/comunidad.component';
import { HombreComponent } from './components/hombre/hombre.component';
import { IndexComponent } from './components/index/index.component';
import { ContenidoComponent } from './components/contenido/contenido.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { BlogComponent } from './components/blog/blog.component';
import { ContactComponent } from './components/contact/contact.component';
import { TiendaComponent } from './tienda.component';
import { MainRoutingModule } from './tienda-routing.module';
import { MyOwnCustomMaterialModule } from './../../app.material.module';
import { RegularPageComponent } from './components/regularpage/regularpage.component';
import { ShopComponent } from './components/shop/shop.component';
import { SingleblogComponent } from './components/singleblog/singleblog.component';
import { SingleproductdetailsComponent } from './components/singleproductdetails/singleproductdetails.component';
import { TiendasComponent } from './components/tiendas/tiendas.component';

@NgModule({
  declarations: [
    MainComponent,
    TiendaComponent,
    ComunidadComponent,
    HombreComponent,
    IndexComponent,
    ContenidoComponent,
    CheckoutComponent,
    BlogComponent,
    ContactComponent,
    RegularPageComponent,
    ShopComponent,
    SingleblogComponent,
    SingleproductdetailsComponent,
    TiendasComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MyOwnCustomMaterialModule
  ]
})
export class TiendaModule { }
