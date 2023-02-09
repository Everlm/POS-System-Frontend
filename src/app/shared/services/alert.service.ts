import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  success (tittle : string, message:string){
    Swal.fire({
      title: tittle,
      text : message,
      icon : 'success',
      confirmButtonColor : '#1D201D',
      width :430
    })
  }
  warn (tittle : string, message:string){
    Swal.fire({
      title: tittle,
      text : message,
      icon : 'warning',
      confirmButtonColor : '#1D201D',
      width :430
    })
  }
  error (tittle : string, message:string){
    Swal.fire({
      title: tittle,
      text : message,
      icon : 'error',
      confirmButtonColor : '#1D201D',
      width :430
    })
  }
}
