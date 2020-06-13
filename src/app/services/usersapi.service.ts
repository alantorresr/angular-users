import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const URL_API = environment.API.EndPoint.Users;

@Injectable({
  providedIn: 'root'
})
export class UsersapiService {

  constructor(private http: HttpClient) { }

  getUserById(id, token) {

    const headers = new HttpHeaders({
      'x-access-token': token
    });

    const data: any = {
      "id": id
    };

    let result: any;
    return this.http.post(`${URL_API}/getbyid`, data, {headers});
    // return result.catalogoAño;
  }

}
