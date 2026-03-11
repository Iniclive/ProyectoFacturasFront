import { Routes } from '@angular/router';

// Importamos los componentes con sus nuevos nombres/rutas
// Ajusta la ruta relativa './features/...' según dónde los hayas movido finalmente
import { ListadoFacturasComponent } from './pages/facturas/listado-facturas/listado-facturas.component';
import { DetalleFacturaComponent } from './pages/facturas/detalle-factura/detalle-factura.component';
export const routes: Routes = [
  // 1. Ruta inicial: Cuando la URL esté vacía, redirige al listado
  {
    path: '',
    redirectTo: 'facturas',
    pathMatch: 'full',
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

  // 5. Comodín (Wildcard): Si el usuario escribe cualquier otra cosa, al listado
  {
    path: '**',
    redirectTo: 'facturas',
  },
];
