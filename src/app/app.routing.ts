import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';

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
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  // {
  //   path: '**',
  //   redirectTo: 'tienda',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
