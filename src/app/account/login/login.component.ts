import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { onDestroy } from '../../core/service/on-destroy.service';
import { MaterialModule } from '../../material.module';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { User } from '../../core/data/user';
import { USER_TYPE } from '../../core/constant/enum';
import { Label, Message, Validation } from '../../core/constant/constant';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, RecaptchaModule, RecaptchaFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  router = inject(Router);
  authService: AuthService = inject(AuthService);
  fb: FormBuilder = inject(FormBuilder);
  toastr: ToastrService = inject(ToastrService);
  destroy$ = onDestroy();
  loginForm: FormGroup;
  isSubmitted: boolean = false;
  hide = true;
  readonly LABEL: typeof Label = Label;
  readonly VALIDATION: typeof Validation = Validation;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      recaptcha: ['', [Validators.required]],
    })
  }

  get f() {
    return this.loginForm.controls;
  }

  onLogin() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      grecaptcha.reset();
      return;
    }
    console.log(this.f['recaptcha']);
    this.authService.login(this.f['userName'].value, this.f['password'].value).then(
      (user: User) => {

        if (user) {
          if (user.userType === USER_TYPE.Admin) {
            this.router.navigate(['/home'])
          }
          else {
            this.toastr.warning(Message.ONLY_ADMIN_CAN_LOGIN, 'Warning');
          }
        }
        else {
          this.toastr.error(Message.INVALID_CREDENTIALS, 'Error');
          this.isSubmitted = false;
          this.loginForm.reset();
          grecaptcha.reset();
        }
      }
    );
  }
}
