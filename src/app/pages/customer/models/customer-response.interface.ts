export interface CustomerResponse {
  clientId: number;
  documentType: string;
  name: string;
  documentNumber: string;
  address: string;
  phone: string;
  email: string;
  state: number;
  stateClient: string;
  auditCreateDate: Date;
  badgeColor: string;
  icView: object;
  icEdit: object;
  icDelete: object;
}

export interface customerResponseById {
  clientId: number;
  name: string;
  email: string;
  documentTypeId: string;
  documentNumber: string;
  address: string;
  phone: string;
  state: number;
}
