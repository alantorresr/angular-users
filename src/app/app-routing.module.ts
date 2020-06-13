import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistogramaComponent } from './pages/histograma/histograma.component';
import { PastelComponent } from './pages/pastel/pastel.component';
import { InicioComponent } from './pages/inicio/inicio.component';


const routes: Routes = [
  { path: '', component: InicioComponent},
  { path: 'histograma', component: HistogramaComponent},
  { path: 'pastel', component: PastelComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
