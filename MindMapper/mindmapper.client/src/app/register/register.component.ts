import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../api';
import { SessionService } from '../services/session.service';

function validatePasswords(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const formGroup = <FormGroup>control;

    const password = formGroup.controls['password'];
    const passwordConfirm = formGroup.controls['passwordConfirm'];

    if (
      password.dirty &&
      passwordConfirm.dirty &&
      password.value !== passwordConfirm.value
    ) {
      return {
        passwordsNotMatching: true,
      };
    }

    return null;
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public registerForm = new FormGroup(
    {
      email: new FormControl<string>('', [Validators.required]),
      userName: new FormControl<string>('', [Validators.required]),
      password: new FormControl<string>('', [Validators.required]),
      passwordConfirm: new FormControl<string>('', [Validators.required]),
    },
    {
      validators: [validatePasswords()],
    }
  );

  constructor(
    private authService: AuthenticationService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  public register(): void {
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
