import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const URL_API = environment.API.EndPoint.Users;

@Injectable({
  providedIn: 'root'
})
export class UsersapiService {

  constructor(private http: HttpClient) { }

  //Users
  getUserById(id, token) {
    const headers = new HttpHeaders({
      'x-access-token': token
    });
    const data: any = {
      id
    };
    return this.http.post(`${URL_API}/users/getbyid`, data, { headers });
  }

  login(email, password) {
    const data: any = {
      email, 
      password
    };
    return this.http.post(`${URL_API}/users/login`, data);
  }

  newUser(name, email, password="123", team, rol="ADMIN") {
    const data: any = {
      name,
      email, 
      password,
      rol,
      team
    };
    return this.http.post(`${URL_API}/users/new`, data);
  }

  getUsersByTeamId(id, token) {
    const headers = new HttpHeaders({
      'x-access-token': token
    });
    const data: any = {
      id
    };
    return this.http.post(`${URL_API}/users/getbyteamid`, data, { headers });
  }

  updateUser(id, token, data) {
    const headers = new HttpHeaders({
      'x-access-token': token
    });
    return this.http.put(`${URL_API}/users/update/${id}`, data, { headers });
  }

  //Teams
  getTeamById(id, token) {
    const headers = new HttpHeaders({
      'x-access-token': token
    });
    const data: any = {
      id
    };
    return this.http.post(`${URL_API}/teams/getbyid`, data, { headers });
  }

  newTeam(name) {
    return this.http.post(`${URL_API}/teams/new`, { name });
  }

  updateTeam(id, token, data) {
    const headers = new HttpHeaders({
      'x-access-token': token
    });
    return this.http.put(`${URL_API}/teams/update/${id}`, data, { headers });
  }

}
