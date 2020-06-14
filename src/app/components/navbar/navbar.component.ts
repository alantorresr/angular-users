import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { UsersapiService } from 'src/app/services/usersapi.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor( private router: Router, private usersApi: UsersapiService ) { }

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

  logout() {
    localStorage.setItem('usuarioLogeado', JSON.stringify(""));
    this.router.navigate(['/login']);
  }

}
