import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersapiService } from 'src/app/services/usersapi.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

constructor( private router: Router, private usersApi: UsersapiService ) { }

public dataApi: any;
public txtEmail: any = "";
public txtPassword: any = "";
public errorText: any;

  ngOnInit(): void {
  }

  goToSignUp() {
    this.router.navigate(['/registro']);
  }

  login() {
    if( this.txtEmail.trim() === "" || this.txtPassword.trim() === "" ) {
      this.errorText = "LLena todos los campos"
      return;
    } else {
      this.usersApi.login(this.txtEmail.trim(), this.txtPassword.trim()).subscribe(res => {
        console.log("LOGIN: ", res)
        this.dataApi = res;
        if(this.dataApi.id) {
          //Logica para llenar local storage con id y token
          let usuarioLogeado: any = {
            id: this.dataApi.id,
            token: this.dataApi.token
          };
          localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioLogeado));
          //Logica para navegar a inicio
          this.router.navigate(['/inicio']);
        } else {
          this.errorText = "El usuario o contraseña son incorrectos"
        }
        
      });
    }
  }

}
