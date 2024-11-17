import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RootComponent } from './root/root.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NetworkProgrammerComponent } from './network-programmer/network-programmer.component';
import { NetworkProgrammerCanvasComponent } from './network-programmer-canvas/network-programmer-canvas.component';
import { NetworkProgrammerCardComponent } from './network-programmer-card/network-programmer-card.component';
import { NetworkProgrammerOptionComponent } from './network-programmer-option/network-programmer-option.component';
import { NetworkTraversalComponent } from './network-traversal/network-traversal.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthenticatedDirective } from './directives/authenticated.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetworkProgrammerCanvasToolbarComponent } from './network-programmer-canvas-toolbar/network-programmer-canvas-toolbar.component';
import { NetworkProgrammerCanvasArrowComponent } from './network-programmer-canvas-arrow/network-programmer-canvas-arrow.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NetworkProgrammerCanvasDraggableComponent } from './network-programmer-canvas-draggable/network-programmer-canvas-draggable.component';

@NgModule({
  declarations: [
    RootComponent,
    RootComponent,
    NavBarComponent,
    NetworkProgrammerComponent,
    NetworkProgrammerCanvasComponent,
    NetworkProgrammerCardComponent,
    NetworkProgrammerOptionComponent,
    NetworkTraversalComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AuthenticatedDirective,
    NetworkProgrammerCanvasToolbarComponent,
    NetworkProgrammerCanvasArrowComponent,
    NetworkProgrammerCanvasDraggableComponent,
  ],
  bootstrap: [RootComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatSnackBarModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class AppModule {}
