import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../api';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });

  constructor(
    private authService: AuthenticationService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  public login(): void {
    this.authService
      .apiAuthenticationLoginPost({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      })
      .subscribe({
        next: (session) => {
          this.sessionService.SaveResponse(session);
          this.router.navigate(['/']);
        },
      });
  }
}
