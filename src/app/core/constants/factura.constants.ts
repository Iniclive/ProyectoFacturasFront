import { IvaItem } from '../models/catalogos.model';
import { Factura } from '../models/factura.model';

export const FACTURA_INICIAL: Factura = {
  // Identificadores (C# Int32 lo tratamos como string '0' por tu interfaz)
  idFactura: '',
  numeroFactura: '',
  fechaFactura: new Date().toISOString(), // Fecha de hoy por defecto

  // Datos Numéricos
  aseguradora: 0,
  importe: 0,
  tipoIva: 21, // El valor que más uses por defecto
  importeIva: 0,
  importeTotal: 0,
  status: 1, // Por ejemplo: 1 = Borrador / Nuevo

  // Auditoría (Valores neutros)
  creado: '',
  creadoPor: 0,
  modificado: '',
  modificadoPor: 0,

  // Campos de la Vista
  nombreUsuario: '',
  nombreEstado: ''
};

export const TIPOS_IVA_DEFAULT: IvaItem[] = [
  { valor: 5, etiqueta: '5%' },
  { valor: 16, etiqueta: '16%' },
  { valor: 21, etiqueta: '21%' }
];
