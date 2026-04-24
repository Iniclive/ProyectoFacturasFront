import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

/**
 * Constantes de rutas
 */
export const APP_PATHS = {
  ROOT: '',
  LOGIN: 'login',
  REGISTER: 'register',
  FORBIDDEN: 'forbidden',

  DASHBOARD: 'dashboard',

  FACTURAS: 'facturas',
  FACTURA_DETALLE: 'facturas/:id',

  USERS: 'users',
  CLIENTS: 'clients',
  PRODUCTS: 'products',
  PROFILE: 'profile',

  WILDCARD: '**',
} as const;

export const routes: Routes = [
  /**
   * Redirección inicial
   */
  {
    path: APP_PATHS.ROOT,
    redirectTo: APP_PATHS.DASHBOARD,
    pathMatch: 'full',
  },

  /**
   * Rutas públicas
   */
  {
    path: APP_PATHS.LOGIN,
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: APP_PATHS.REGISTER,
    loadComponent: () =>
      import('./pages/auth/registro/registro.component').then(
        (m) => m.RegistroComponent
      ),
  },
  {
    path: APP_PATHS.FORBIDDEN,
    loadComponent: () =>
      import('./pages/auth/forbidden/forbidden.component').then(
        (m) => m.ForbiddenComponent
      ),
  },

  /**
   * Rutas protegidas
   */
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: APP_PATHS.DASHBOARD,
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },

      {
        path: APP_PATHS.FACTURAS,
        loadComponent: () =>
          import(
            './pages/facturas/listado-facturas/listado-facturas.component'
          ).then((m) => m.ListadoFacturasComponent),
      },

      {
        path: APP_PATHS.FACTURA_DETALLE,
        loadComponent: () =>
          import(
            './pages/facturas/detalle-factura/detalle-factura.component'
          ).then((m) => m.DetalleFacturaComponent),
      },

      {
        path: APP_PATHS.USERS,
        loadComponent: () =>
          import(
            './pages/users/users.component/users.component'
          ).then((m) => m.UsersComponent),
      },

      {
        path: APP_PATHS.CLIENTS,
        loadComponent: () =>
          import(
            './pages/clients/client.component/client.component'
          ).then((m) => m.ClientComponent),
      },

      {
        path: APP_PATHS.PRODUCTS,
        loadComponent: () =>
          import(
            './pages/products-and-services/products-and-services'
          ).then((m) => m.ProductsAndServices),
      },

      {
        path: APP_PATHS.PROFILE,
        loadComponent: () =>
          import('./pages/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
    ],
  },

  /**
   * Wildcard
   */
  {
    path: APP_PATHS.WILDCARD,
    redirectTo: APP_PATHS.DASHBOARD,
  },
];
