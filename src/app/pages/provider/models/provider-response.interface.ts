export interface ProviderResponse {
  providerId: number;
  name: string;
  email: string;
  documentType: string;
  documentNumber: string;
  address: string;
  phone: string;
  auditCreateDate: Date;
  state: number;
  stateProvider: string;
  badgeColor: string;
  iconEdit: any;
  iconDelete: any;
}
