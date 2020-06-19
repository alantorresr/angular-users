import { Component, OnInit } from '@angular/core';
import { UsersapiService } from 'src/app/services/usersapi.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  constructor(private usersApi: UsersapiService) { }

  public dataApi: any;
  public dataTeam: any;

  public name: any;
  public email: any;
  public rol: any;
  public teamName: any;

  public isEditing = false;

  public messageErrors: any = {
    name: "",
    email: "",
    teamName: ""
  };

  public avatar: any;

  ngOnInit(): void {
    this.cargarInformacion();
  }

  cargarInformacion(): void {
    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    //Se obtiene informacion del usuairo
    this.usersApi.getUserById(usuarioLogeado.id, usuarioLogeado.token)
    .subscribe( res => {
        this.dataApi = res;
        this.dataApi = this.dataApi.result;
        this.name = this.dataApi.name;
        this.email= this.dataApi.email;
        this.rol= this.dataApi.rol;
        //Se obtiene infomacion del equipo
        this.usersApi.getTeamById(this.dataApi.team, usuarioLogeado.token)
        .subscribe( res => {
          this.dataTeam = res;
          this.dataTeam = this.dataTeam.result;
          this.teamName= this.dataTeam.name;
        }, err => {
          console.log(err)
        });
      }, err => { 
        console.log(err) 
      });
    this.obtenerAvatar();
  }

  editarInformacion(): void {
    this.isEditing = true;
  }

  cancelar(): void {
    this.isEditing = false;
  }

  async actualizarInformacion() {
    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    const isValid = await this.validate();
    if(!isValid) {
      console.log(this.name, this.teamName)
      const data = {
        name: this.name
      };
      this.usersApi.updateUser(usuarioLogeado.id, usuarioLogeado.token, data)
        .subscribe( res => {
          console.log("RES: ", res);
        }, err => {
          console.log(err)
      });
      const teamData = {
        name: this.teamName
      };
      this.usersApi.updateTeam(this.dataTeam._id, usuarioLogeado.token, teamData)
        .subscribe( res => {
          console.log("RES: ", res);
        }, err => {
          console.log(err)
      });
    }
    this.isEditing = false;
    this.cargarInformacion();
  }

  validate(): boolean {
    let error: boolean = false;
    this.messageErrors = {
      name: "",
      teamName: ""
    };
    if(this.name.trim() === "") {
      this.messageErrors.name = "Nombre requerido";
      error = true;
    }
    if(this.teamName.trim() === "") {
      this.messageErrors.teamName = "Nombre de equipo requerido";
      error = true;
    }
    return error
  }

  //Crear metodo para obtener una foto randoom
  async obtenerAvatar() {
    const numero = Math.floor(Math.random() * 100) + 1;
    this.avatar = `https://api.adorable.io/avatars/${numero}`;
  }
}
