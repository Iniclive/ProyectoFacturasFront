// Para Aseguradoras, Usuarios, Estados, etc.
export interface Insurance{
  idInsurance: number;
  name: string;
}

export interface IvaItem {
  valor: number;
  etiqueta: string;
}


export interface InvoiceStatus {
  value: number;
  statusName: string;
}
