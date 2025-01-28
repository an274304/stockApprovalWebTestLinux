import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  toast(title: string, icon: 'success' | 'error' | 'warning'){
    return  Swal.fire({
      toast: true,
      position: 'top-end',
      icon: icon,
      title: title,
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true
    });
  }

  message(title: string, icon: 'success' | 'error' | 'warning'){
    return  Swal.fire({
      title: title,
      icon: icon
    });
  }
}
