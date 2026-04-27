

export interface Client {
  clientId: string;
  commercialName?: string;
  legalName: string;
  cif: string;
  email: string;
  phone?: string;
  address?: string;
  creationDate: string;
}

export interface ClientCreate{
commercialName?: string;
legalName: string;
cif: string;
email: string;
phone?: string;
address?: string;
}

export interface ClientUpdate{
clientId: string;
commercialName?: string;
legalName?: string;
cif: string;
email: string;
phone?: string;
address?: string;
}


