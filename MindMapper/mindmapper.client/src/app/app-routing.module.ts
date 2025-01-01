import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NetworkProgrammerCanvasComponent } from './network-programmer-canvas/network-programmer-canvas.component';
import { NetworkProgrammerComponent } from './network-programmer/network-programmer.component';
import { NetworkTraversalComponent } from './network-traversal/network-traversal.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { NetworkTraversalHolderComponent } from './network-traversal-holder/network-traversal-holder.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    children: [
      { path: 'programming', component: NetworkProgrammerComponent },
      {
        path: 'programming/canvas',
        component: NetworkProgrammerCanvasComponent,
      },
      { path: 'traversal', component: NetworkTraversalComponent },
      { path: 'traversal/network', component: NetworkTraversalHolderComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
