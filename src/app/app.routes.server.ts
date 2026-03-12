import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'facturas/:id',
    renderMode: RenderMode.Server  // cambia de Prerender a Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
