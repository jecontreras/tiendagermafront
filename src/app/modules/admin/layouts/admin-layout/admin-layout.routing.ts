import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { Host } from '@angular/core';
import { ClienteComponent } from '../../cliente/cliente.component';
import { ProductosComponent } from '../../productos/productos.component';
import { FacturaComponent } from '../../factura/factura.component';
import { CategoriasComponent } from '../../categorias/categorias.component';
import { MarcasComponent } from '../../marcas/marcas.component';
import { ColorComponent } from '../../color/color.component';
import { TallasComponent } from '../../tallas/tallas.component';
import { EmpresaComponent } from '../../empresa/empresa.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'clientes',        component: ClienteComponent},
    { path: 'productos',        component: ProductosComponent},
    { path: 'factura',        component: FacturaComponent},
    { path: 'categorias',        component: CategoriasComponent},
    { path: 'marcas',        component: MarcasComponent},
    { path: 'tallas',        component: TallasComponent},
    { path: 'empresa',        component: EmpresaComponent},
    { path: 'color',        component: ColorComponent},
    { path: '',  redirectTo: 'dashboard'},
    { path: '**', component: DashboardComponent }
];
