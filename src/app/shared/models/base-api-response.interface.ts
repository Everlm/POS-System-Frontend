export interface BaseResponse<T = any> {
  isSuccess: boolean;
  data: any;
  totalRecords: number;
  message: any;
  errors: any;
}
