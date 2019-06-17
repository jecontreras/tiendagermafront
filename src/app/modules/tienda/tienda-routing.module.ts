import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TiendaComponent } from './tienda.component';
import { MainComponent } from './components/main/main.component';
import { ComunidadComponent } from './components/comunidad/comunidad.component';
import { HombreComponent } from './components/hombre/hombre.component';


const tienda: Routes = [
 {
   path: '',
   component: TiendaComponent,
   // canActivate: [AuthService],
   children: [
     {path: '', redirectTo: 'home', pathMatch: 'full'},
     {path: 'home', component: MainComponent},
     {path: 'comunidad', component: ComunidadComponent},
     {path: 'hombre', component: HombreComponent},
     {path: '**', redirectTo: 'home', pathMatch: 'full'}
   ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(tienda)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
