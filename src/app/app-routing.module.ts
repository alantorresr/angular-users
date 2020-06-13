import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistogramaComponent } from './pages/histograma/histograma.component';
import { PastelComponent } from './pages/pastel/pastel.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';


const routes: Routes = [
  { path: 'inicio', component: InicioComponent},
  { path: 'histograma', component: HistogramaComponent},
  { path: 'pastel', component: PastelComponent},
  { path: 'login', component: LoginComponent},
  { path: 'registro', component: RegistroComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
