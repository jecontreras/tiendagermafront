import { NgModule } from '@angular/core';
import { Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FactoryModelService } from './../../../services/factory-model.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
  ]
})
@Injectable({
  providedIn: 'root'
})
export class ComponentsModule {
  constructor(
    private _model: FactoryModelService
  ){
    this._model.loadUser();
  }
}
