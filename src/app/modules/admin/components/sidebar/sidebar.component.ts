import { Component, OnInit } from '@angular/core';
import { FactoryModelService } from './../../../../services/factory-model.service';
import * as _ from 'lodash';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    rol: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/admin/dashboard', title: 'Dashboard',  icon: 'dashboard', rol: "varios", class: '' },
    { path: '/admin/user-profile', title: 'Perfil',  icon:'person', rol: "varios", class: '' },
    // { path: '/admin/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    // { path: '/admin/typography', title: 'Typography',  icon:'library_books', class: '' },
    // { path: '/admin/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    // { path: '/admin/maps', title: 'Maps',  icon:'location_on', class: '' },
    // { path: '/admin/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    { path: '/admin/clientes', title: 'Clientes',  icon:'group', rol: "admin", class: '' },
    { path: '/admin/productos', title: 'Productos',  icon:'local_mall', rol: "admin", class: '' },
    { path: '/admin/categorias', title: 'Categorias',  icon:'style', rol: "admin", class: '' },
    { path: '/admin/marcas', title: 'Marcas',  icon:'class', rol: "admin", class: '' },
    { path: '/admin/color', title: 'Color',  icon:'invert_colors', rol: "superadmin", class: '' },
    { path: '/admin/tallas', title: 'Tallas',  icon:'pregnant_woman', rol: "superadmin", class: '' },
    { path: '/admin/factura', title: 'Factura',  icon:'local_grocery_store', rol: "varios", class: '' },
    { path: '/admin/empresa', title: 'Empresa',  icon:'store', rol: "superadmin", class: '' },
    { path: '/admin/mercados', title: 'Mercados',  icon:'pageview', rol: "superadmin", class: '' },
    // { path: '/admin/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  menus: any = [];

  constructor(
    private _model: FactoryModelService
  ) { }

  ngOnInit() {
    this.menus = ROUTES.filter(menuItem => menuItem);
    const
      user: any = JSON.parse(localStorage.getItem('user'));
    ;
    this._model.loadUser();
    var menuItems: any = [];
    console.log(user);
    if(user){
     if(user.rol){
       if(user.rol.nombre !== "super admin"){
         _.forEach(this.menus, function(item: any, idx: any){
           // console.log(item);
           if(item){
             if(user.rol.nombre === 'admin'){
               if(item.rol !== "superadmin"){
                 menuItems.push(item);
               }
             }
             if(user.rol.nombre === 'usuario'){
               if(item.rol !== "superadmin" && item.rol !== 'admin'){
                 menuItems.push(item);
               }
             }
           }
         })
         ;
       }else{
         menuItems = this.menus;
       }
     }
    }
    this.menuItems = menuItems;
    // console.log(this.menuItems);
  }
  logout() {
    // localStorage.clear();
    localStorage.removeItem('user');
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
