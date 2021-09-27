import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private toastr: ToastrService) { }

  showerror(mensaje: string) {
    this.toastr.error(mensaje);
  }

  showsuccess(mensaje: string) {
    this.toastr.success(mensaje);
  }

  showwarning(mensaje: string) {
    this.toastr.warning(mensaje);
  }

  formatCurrency(fractionDigits: number, number: number) { //"en-US", "USD"
    var formatted = new Intl.NumberFormat("en-US", {
      style: 'currency',
      currency: "USD",
      minimumFractionDigits: fractionDigits
    }).format(number);
    return formatted;
  }

  currencyToNumber(value: string){
    let data = value.replace('$','');
    const regex = /,/g;
    data = data.replace(regex,'');
    return parseFloat(data);
  }
}
