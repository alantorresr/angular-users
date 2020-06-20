import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { UsersapiService } from 'src/app/services/usersapi.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})

export class UsuariosComponent implements OnInit {

  constructor(private usersApi: UsersapiService, private router: Router) { }

  public dataApi: any;
  public rol: any;

  public dataTeamMembers: any;

  public txtName = "";
  public txtEmail = "";
  public selectedRol = "BARS";
  public editingUserId = "";

  public isEditing = false;
  public noUsers = false;

  public messageErrors: any = {
    name: "",
    email: "",
    rol: ""
  };

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    this.usersApi.getUserById(usuarioLogeado.id, usuarioLogeado.token)
    .subscribe( res => {
      this.dataApi = res;
      this.dataApi = this.dataApi.result;
      this.rol = this.dataApi.rol
      if(this.rol !== "ADMIN") {
        this.router.navigate(['/inicio']);
      }
      this.usersApi.getUsersByTeamId(this.dataApi.team, usuarioLogeado.token)
        .subscribe( res => {
          this.dataTeamMembers = res;
          this.dataTeamMembers = this.dataTeamMembers.result;
          this.dataTeamMembers = this.dataTeamMembers.filter(member => member._id !== this.dataApi._id);
          if(this.dataTeamMembers.length === 0) {
            this.noUsers = true;
          } else {
            this.noUsers = false;
          }
          // console.log("Members", this.dataTeamMembers);
        }, err => {
          console.log(err)
        });
    }, err => { 
        console.log(err) 
    });
  }

  async nuevoUsuario() {
    const isValid = await this.validate();
    if(!isValid) {
      this.usersApi.newUser(this.txtName, this.txtEmail, "123", this.dataApi.team, this.selectedRol)
        .subscribe( res => {
          // console.log("RES: ", res);
          let result: any = res;
          if (!result.ok && result.message === "This email already exist in the database.") {
            this.messageErrors.email = "Ya existe un usuario con este correo";
          }
        }, err => {
          console.log(err)
      });
      this.cargarUsuarios();
      this.limpiarFormulario();
    }
  }

  activarUsuario(id) {
    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    const data = {
      active: true
    };
    this.usersApi.updateUser(id, usuarioLogeado.token, data)
        .subscribe( res => {
          // console.log("RES: ", res);
        }, err => {
          console.log(err)
    });
    this.cargarUsuarios();
  }

  desactivarUsuario(id) {
    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    const data = {
      active: false
    };
    this.usersApi.updateUser(id, usuarioLogeado.token, data)
        .subscribe( res => {
          // console.log("RES: ", res);
        }, err => {
          console.log(err)
    });
    this.cargarUsuarios();
  }

  editarUsuario(usuario) {
    this.isEditing = true;
    const { name, email, rol, _id } = usuario;
    this.txtName = name;
    this.txtEmail = email;
    this.selectedRol = rol;
    this.editingUserId = _id;
  }

  async actualizarUsuario() {
    this.isEditing = false;
    // console.log(this.txtName, this.txtEmail, this.selectedRol, this.editingUserId);
    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    const data = {
      name: this.txtName, 
      email: this.txtEmail,
      rol: this.selectedRol
    };
    const isValid = await this.validate();
    if(!isValid) {
      this.usersApi.updateUser(this.editingUserId, usuarioLogeado.token, data)
        .subscribe( res => {
          // console.log("RES: ", res);
        }, err => {
          console.log(err)
      });
    }
    this.cargarUsuarios();
    this.limpiarFormulario();
  }

  cancelar() {
    this.limpiarFormulario();
    this.isEditing = false;
  }

  limpiarFormulario(): void {
    this.txtName = "";
    this.txtEmail = "";
    this.selectedRol = "BARS";
    this.editingUserId = "";
  }

  validate(): boolean {
    let error: boolean = false;
    this.messageErrors = {
      name: "",
      email: "",
      rol: ""
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
    if(!emailRegex.test(this.txtEmail.trim())) {
      this.messageErrors.email = "Email iválido";
      error = true;
    }

    return error
  }

}