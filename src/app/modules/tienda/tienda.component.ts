import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.scss']
})
export class TiendaComponent implements OnInit {
  public data: any = {};
  public menu: any = [];
  public menu2: any = [];
  public footer: any = [];
  constructor() { }

  ngOnInit() {
    this.menu = [
      {
        titulo: 'Inicio',
        srf: 'home'
      },
      {
        titulo: 'Hombre',
        srf: 'hombre'
      },
      {
        titulo: 'Mujer',
        srf: 'home'
      },
      {
        titulo: 'Comunidad',
        srf: 'comunidad'
      },
      {
        titulo: 'Tiendas',
        srf: 'home'
      },
      {
        titulo: 'Sales',
        srf: 'home'
      },
      {
        titulo: 'Niños',
        srf: 'home'
      }
    ]
    ;
    this.menu2 = [
      {
        titulo: 'Mi Pedido',
        icon: 'briefcase'
      },
      {
        titulo: 'Ingresa'
      }
    ]
    ;
    this.footer = [
      {
        titulo: 'Contacto'
      },
      {
        titulo: 'Trabaja Con Nosotros'
      },
      {
        titulo: 'Envios'
      },
      {
        titulo: 'Cambios y Garantias'
      },
      {
        titulo: 'Preguntas Frecuentes'
      },
      {
        titulo: 'Terminos y Condiciones'
      }
    ]
  }

}
