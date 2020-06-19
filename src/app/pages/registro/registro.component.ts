import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersapiService } from 'src/app/services/usersapi.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  constructor( private router: Router, private usersApi: UsersapiService ) { }

  public dataApi: any;

  public txtName: any = "";
  public txtEmail: any = "";
  public txtPassword: any = "";
  public txtConfirmPassword: any = "";
  public txtTeam: any = "";

  public messageErrors: any = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    team: ""
  };

  public team: any;
  public teamId: any = "";

  ngOnInit(): void {
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async signup() {
    const isValid = await this.validate();
    if(!isValid) {
      console.log("Válido");
      const data: any = {
      };
      this.usersApi.newTeam(this.txtTeam.trim())
      .subscribe( res => { 
        console.log(res)
        this.team = res;
        this.teamId = this.team.message;
        console.log("TEAM_ID: ", this.teamId)
        this.usersApi.newUser(this.txtName.trim(), this.txtEmail.trim(), this.txtPassword.trim(), this.teamId)
        .subscribe(res => {
          this.dataApi = res;
          console.log(this.dataApi)
          if(this.dataApi.ok){
            let usuarioLogeado: any = {
              id: this.dataApi.id,
              token: this.dataApi.token
            };
            localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioLogeado));
            this.router.navigate(['/inicio']);
          } else if (!this.dataApi.ok && this.dataApi.message === "This email already exist in the database.") {
            this.messageErrors.email = "Ya existe un usuario con este correo";
          }else if(!this.dataApi.ok) {
            this.messageErrors.team = "No se pudo completar el registro, inténtelo de nuevo";
          }
          
        });
      }, err => { 
        console.log(err) 
      });

      
    }
  }

  validate(): boolean {
    let error: boolean = false;
    this.messageErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      team: ""
    };
    const emailRegex = RegExp(/.+@.+\.[A-Za-z]+$/);

    if(this.txtName.trim() === "") {
      this.messageErrors.name = "Nombre requerido";
      error = true;
    }
    if(this.txtEmail.trim() === "") {
      this.messageErrors.email = "Email requerido";
      error = true;
    }
    if(this.txtPassword.trim() === "") {
      this.messageErrors.password = "Contraseña requerida";
      error = true;
    }
    if(this.txtConfirmPassword.trim() === "") {
      this.messageErrors.confirmPassword = "Confirmar contraseña requerida";
      error = true;
    }
    if(this.txtTeam.trim() === "") {
      this.messageErrors.team = "Equipo requerido";
      error = true;
    }
    if(this.txtConfirmPassword.trim() !== this.txtPassword.trim()) {
      this.messageErrors.confirmPassword = "Las contraseñas deben coincidir";
      error = true;
    }
    if(!emailRegex.test(this.txtEmail.trim())) {
      this.messageErrors.email = "Email iválido";
      error = true;
    }

    return error
  }

}
