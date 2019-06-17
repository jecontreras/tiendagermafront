import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { ComunidadComponent } from './components/comunidad/comunidad.component';
import { HombreComponent } from './components/hombre/hombre.component';
import { TiendaComponent } from './tienda.component';
import { MainRoutingModule } from './tienda-routing.module';
import { MyOwnCustomMaterialModule } from './../../app.material.module';

@NgModule({
  declarations: [
    MainComponent,
    TiendaComponent,
    ComunidadComponent,
    HombreComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MyOwnCustomMaterialModule
  ]
})
export class TiendaModule { }
