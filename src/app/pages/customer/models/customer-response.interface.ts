export interface CustomerResponse {
    customerId: number;
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