import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})

export class PasswordMatchService{

  matchPassword(control: AbstractControl) {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;
    if (control.get('confirmPassword').errors && !control.get('confirmPassword').errors['matchPassword']) {
      return null;
    }
    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({ matchPassword: true });
    }
    else {
      control.get('confirmPassword').setErrors(null);
    }
  }

}
