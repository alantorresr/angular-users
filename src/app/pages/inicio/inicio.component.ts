import { Component, OnInit } from '@angular/core';
import { UsersapiService } from 'src/app/services/usersapi.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  constructor(private usersApi: UsersapiService) { }

  public dataApi: any;
  public rol: any;

  ngOnInit(): void {

    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    this.usersApi.getUserById(usuarioLogeado.id, usuarioLogeado.token).subscribe(
      res => {
        this.dataApi = res;
        this.dataApi = this.dataApi.result;
        this.rol = this.dataApi.rol
      }, 
      err => { console.log(err) });

  }

}
