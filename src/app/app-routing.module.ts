import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistogramaComponent } from './pages/histograma/histograma.component';
import { PastelComponent } from './pages/pastel/pastel.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AuthGuard } from './guards/auth.guard';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';


const routes: Routes = [
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard]},
  { path: 'histograma', component: HistogramaComponent, canActivate: [AuthGuard]},
  { path: 'pastel', component: PastelComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard]},
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
