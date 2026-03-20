import { Routes } from '@angular/router';
import { ListadoFacturasComponent } from './pages/facturas/listado-facturas/listado-facturas.component';
import { DetalleFacturaComponent } from './pages/facturas/detalle-factura/detalle-factura.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegistroComponent } from './pages/auth/registro/registro.component';
export const routes: Routes = [
  // 1. Ruta inicial: Cuando la URL esté vacía, redirige al listado
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  // 2. Ruta del Listado: Aquí se mostrará tu tabla actual
  {
    path: 'facturas',
    component: ListadoFacturasComponent,
  },
  // 3. Ruta para Crear: Formulario vacío
  {
    path: 'facturas/:id', // Este :id capturará tanto un número como la palabra 'nueva'
    component: DetalleFacturaComponent,
    title: 'Detalle de Factura',
  },
  {
    path: 'register',
    component: RegistroComponent,
  },

  // 5. Comodín (Wildcard): Si el usuario escribe cualquier otra cosa, al listado
  {
    path: '**',
    redirectTo: 'facturas',
  },
];
