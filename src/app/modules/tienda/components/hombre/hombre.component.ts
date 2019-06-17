import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hombre',
  templateUrl: './hombre.component.html',
  styleUrls: ['./hombre.component.scss']
})
export class HombreComponent implements OnInit {
  public submenu: any = [];
  public color: any = [];
  public tallas: any = [];
  public articulos: any = [];

  constructor() {

  }
  ngOnInit() {
    this.submenu = [
      {
        titulo: 'Camisetas'
      },
      {
        titulo: 'Tanks'
      },
      {
        titulo: 'Polos'
      },
      {
        titulo: 'Busos'
      },
      {
        titulo: 'Camisas'
      },
      {
        titulo: 'Shorts'
      },
      {
        titulo: 'Jeans y Pantalones'
      },
      {
        titulo: 'Jogger'
      }
    ]
    ;
    this.color = [
      {
        titulo: 'Amarillo'
      },
      {
        titulo: 'Azul'
      },
      {
        titulo: 'Azul Oscuro'
      },
      {
        titulo: 'Beige'
      },
      {
        titulo: 'Blanco'
      },
      {
        titulo: 'Gris'
      },
      {
        titulo: 'Marfil'
      },
      {
        titulo: 'Morado'
      },
      {
        titulo: 'Mostaza'
      },
      {
        titulo: 'Naranja'
      }
    ]
    ;
    this.tallas = [
      {
        titulo: 'S'
      },
      {
        titulo: 'M'
      },
      {
        titulo: 'L'
      }
    ]
    ;
    this.articulos = [
      {
        titulo: '1'
      },
      {
        titulo: '2'
      },
      {
        titulo: '3'
      },
      {
        titulo: '4'
      },
      {
        titulo: '5'
      },
      {
        titulo: '6'
      },
    ]
    ;
  }
}
