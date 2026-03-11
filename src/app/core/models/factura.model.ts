export interface Factura {
  // Identificadores y Claves
  idFactura: string; // En C# es Int32
  numeroFactura: string | null;
  fechaFactura: string; // Las fechas en JSON viajan como string (ISO 8601)

  // Relaciones y Datos Numéricos
  aseguradora: number;
  importe: number | null; // Decimal? -> number
  tipoIva: number | null;
  importeIva: number | null;
  importeTotal: number | null;
  status: number;

  // Auditoría
  creado: string;
  creadoPor: number;
  modificado: string;
  modificadoPor: number;

  // Campos de la Vista (JOINs)
  nombreUsuario: string | null;
  nombreEstado: string | null;
  nombreAseguradora?: string | null; // Para mostrar el nombre en la lista simple
}


export interface FacturaSimple {
  idFactura: string,
  numeroFactura: string;
  nombreAseguradora: string;
  importe: number;
  tipoIva: number;
  importeTotal: number;
}

export interface FacturaCreate {
  numeroFactura: string | null;
  fechaFactura: string;
  aseguradora: number;
  importe: number | null;
  tipoIva: number | null;
  importeIva: number | null;
  importeTotal: number | null;
  status: number;
}
