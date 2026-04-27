import { Client, ClientCreate, ClientUpdate } from "../../features/clients/client.models";

export function mapToClientUpdate(c: Client): ClientUpdate {
  return {
    clientId: c.clientId,
    legalName: c.legalName,
    commercialName: c.commercialName,
    cif: c.cif,
    email: c.email,
    phone: c.phone,
    address: c.address
  };
}

export function mapToClientCreate(c: Client): ClientCreate {
  return {
    legalName: c.legalName,
    commercialName: c.commercialName,
    cif: c.cif,
    email: c.email,
    phone: c.phone,
    address: c.address
  };
}
