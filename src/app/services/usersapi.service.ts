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
      id
    };

    let result: any;
    return this.http.post(`${URL_API}/getbyid`, data, {headers});
    // return result.catalogoAño;
  }

  login(email, password) {
    const data: any = {
      email, 
      password
    };
    return this.http.post(`${URL_API}/login`, data);
  }

  newUser(name, email, password, team, rol="ADMIN") {
    const data: any = {
      name,
      email, 
      password,
      rol,
      team
    };
    return this.http.post(`${URL_API}/new`, data);
  }

}
