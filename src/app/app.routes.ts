import { Routes } from '@angular/router';
import { ListadoFacturasComponent } from './pages/facturas/listado-facturas/listado-facturas.component';
import { DetalleFacturaComponent } from './pages/facturas/detalle-factura/detalle-factura.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegistroComponent } from './pages/auth/registro/registro.component';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { ForbiddenComponent } from './pages/auth/forbidden/forbidden.component';
import { UsersComponent } from './pages/users/users.component/users.component';
import { ClientComponent } from './pages/clients/client.component/client.component';
import { ProductsAndServices } from './pages/products-and-services/products-and-services';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
export const routes: Routes = [
  // 1. Ruta inicial: redirige al dashboard (el authGuard mandará al login si no hay sesión)
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard]
  },
  // 2. Dashboard: página principal tras el login
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  // 3. Ruta del Listado: Aquí se mostrará tu tabla actual
  {
    path: 'facturas',
    component: ListadoFacturasComponent,
    canActivate: [authGuard]
  },
  // 3. Ruta para Crear: Formulario vacío
  {
    path: 'facturas/:id', // Este :id capturará tanto un número como la palabra 'nueva'
    component: DetalleFacturaComponent,
    canActivate: [authGuard],
  },
  {
    path: 'register',
    component: RegistroComponent,
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent,
  },
  {
    path: 'users',
    canActivate: [authGuard],
    component: UsersComponent,
  },
  {
    path: 'clients',
    canActivate: [authGuard],
    component: ClientComponent,
  },
  {
    path: 'products',
    canActivate: [authGuard],
    component: ProductsAndServices,
  },
  // 5. Comodín (Wildcard): Si el usuario escribe cualquier otra cosa, al dashboard
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
