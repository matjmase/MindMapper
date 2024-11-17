import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../api';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public registerForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required]),
    userName: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
    passwordConfirm: new FormControl<string>('', [Validators.required]),
  });

  constructor(
    private authService: AuthenticationService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  public login(): void {
    this.authService
      .apiAuthenticationRegisterPost({
        email: this.registerForm.value.email,
        userName: this.registerForm.value.userName,
        password: this.registerForm.value.password,
      })
      .subscribe({
        next: (session) => {
          this.sessionService.SaveResponse(session);
          this.router.navigate(['/']);
        },
      });
  }
}
