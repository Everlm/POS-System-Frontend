export interface PaginatedResponse {
  data: any;
  totalRecords: number;
}

export interface ApiResponse {
  isSuccess: boolean;
  data: any;
  message: any;
  errors: any;
}
