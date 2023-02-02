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
      confirmButtonColor : 'rgb(210, 155, 253)',
      width :430
    })
  }
  warn (tittle : string, message:string){
    Swal.fire({
      title: tittle,
      text : message,
      icon : 'warning',
      confirmButtonColor : 'rgb(210, 155, 253)',
      width :430
    })
  }
  error (tittle : string, message:string){
    Swal.fire({
      title: tittle,
      text : message,
      icon : 'error',
      confirmButtonColor : 'rgb(210, 155, 253)',
      width :430
    })
  }
}
