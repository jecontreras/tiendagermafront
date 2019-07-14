import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TiendaComponent } from './tienda.component';
import { MainComponent } from './components/main/main.component';
import { ComunidadComponent } from './components/comunidad/comunidad.component';
import { HombreComponent } from './components/hombre/hombre.component';
import { IndexComponent } from './components/index/index.component';
import { ContenidoComponent } from './components/contenido/contenido.component';
import { BlogComponent } from './components/blog/blog.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { RegularPageComponent } from './components/regularpage/regularpage.component';
import { ContactComponent } from './components/contact/contact.component';
import { ShopComponent } from './components/shop/shop.component';
import { SingleblogComponent } from './components/singleblog/singleblog.component';
import { SingleproductdetailsComponent } from './components/singleproductdetails/singleproductdetails.component';
import { TiendasComponent } from './components/tiendas/tiendas.component';


const tienda: Routes = [
 {
   path: '',
   component: TiendaComponent,
   // canActivate: [AuthService],
   children: [
     {path: '', redirectTo: 'contenido', pathMatch: 'full'},
     // {path: 'home', component: MainComponent},
     // {path: 'comunidad', component: ComunidadComponent},
     {path: 'contenido', component: ContenidoComponent},
     {path: 'index', component: IndexComponent },
     {path: 'blog', component: BlogComponent },
     {path: 'checkout/:id', component: CheckoutComponent },
     {path: 'shop/checkout/:id', component: CheckoutComponent },
     {path: 'contact/checkout/:id', component: CheckoutComponent },
     {path: 'contact', component: ContactComponent },
     {path: 'contact/:id', component: ContactComponent },
     {path: 'regularpage', component: RegularPageComponent },
     {path: 'shop', component: ShopComponent },
     {path: 'shop/:id', component: ShopComponent },
     // {path: 'singleblog', component: SingleblogComponent },
     {path: 'shop/singleproductdetails/:id', component: SingleproductdetailsComponent },
     {path: 'singleproductdetails/:id', component: SingleproductdetailsComponent },
     {path: 'tiendas', component: TiendasComponent },
     {path: '**', redirectTo: 'contenido', pathMatch: 'full'}
   ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(tienda)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
