import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const URL_API = environment.API.EndPoint.NorthWind;

@Injectable({
  providedIn: 'root'
})
export class NorthwindService {

  constructor(private http: HttpClient) { }

  getHistoricoVentas() {
    return this.http.get(`${URL_API}HistoricoVentas`);
  }

  getHistoricoVentasMes() {
    return this.http.get(`${URL_API}HistoricoVentasMes`);
  }

  getHistoricoVentasCombinado() {
    return this.http.get(`${URL_API}HistoricoVentasCombinado`);
  }

  getCatalogoAnio() {
    let result: any;
    result = this.http.get(`${URL_API}HistoricoVentasMes`);
    return result.catalogoAño;
  }

}
