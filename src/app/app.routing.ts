import { NgModule, Component} from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { RegistryComponent } from './components/registry/registry.component';
import { FactoryModelService } from './services/factory-model.service';

import { AdminLayoutComponent } from './modules/admin/layouts/admin-layout/admin-layout.component';
const routes: Routes =[
  /* {
    path: 'admin',
    loadChildren: './modules/admin/layouts/admin-layout/admin-layout.module#AdminLayoutModule'
  }, */
  {
  path: 'admin',
    component: AdminLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: './modules/admin/layouts/admin-layout/admin-layout.module#AdminLayoutModule'
  }]},
  {
    path: 'tienda',
    loadChildren: './modules/tienda/tienda.module#TiendaModule'
  },
  {
    path: 'home', component: MainComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'login/:id', component: LoginComponent
  },
  {
    path: 'registro', component: RegistryComponent
  },
  {
    path: '',
    redirectTo: 'tienda',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'tienda',
    pathMatch: 'full'
  }
];
import { App } from './models/app';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule{
  public app:App[];

  constructor(
    private _model:FactoryModelService
  ){
    this._model.loadapp().subscribe((studentsData: App[]) => {
      // console.log(studentsData);
    });
  }
}
