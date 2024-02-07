import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { RegisterService } from './register.service';
import { take } from 'rxjs';

export interface RegisterData {
  email: string;
  password: string;
}


@Component({
  selector: 'qzy-register-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  private readonly registerService = inject(RegisterService);
  private readonly router = inject(Router);

  @Output() register = new EventEmitter<RegisterData>();

  registerForm: FormGroup;
  get username() {
    return this.registerForm.controls['username'];
  }
  get email() {
    return this.registerForm.controls['email'];
  }
  get password() {
    return this.registerForm.controls['password'];
  }
  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: [matchValidator] }
    );
  }

  doRegister() {
    this.registerService.register(this.registerForm.value.username, this.registerForm.value.email, this.registerForm.value.password)
      .pipe(take(1)).subscribe((result) => {
        if (result.isSuccess) {
          this.router.navigateByUrl('');
        }
        else {
          alert(result.errors.join('\n'));
        }
    });

    const { email, password } = this.registerForm.value;
    this.register.emit({ email, password });
  }
}

function matchValidator(control: AbstractControl) {
  const password: string = control.get('password')?.value;
  const confirmPassword: string = control.get('confirmPassword')?.value;

  if (!confirmPassword?.length || !password?.length) {
    return null;
  }

  if (password !== confirmPassword) {
    return { mismatch: true };
  }

  return null;
}
