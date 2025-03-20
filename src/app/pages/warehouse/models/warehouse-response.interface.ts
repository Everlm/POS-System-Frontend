export interface WarehouseResponse {
  warehouseId: number;
  name: string;
  auditCreateDate: Date;
  stateWarehouse: string;
  state: number;
  badgeColor: string;
  iconEdit: any;
  iconDelete: any;
}

export interface WarehouseById {
  warehouseId: number;
  name: string;
  state: number;
}
