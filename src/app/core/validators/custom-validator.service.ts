import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidator {
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string).indexOf(' ') >= 0) {
      return { cannotContainSpace: true };
    }
    return null;
  }

  static weekPassword(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const hasNumber = /\d/.test(control.value);
      const hasUpper = /[A-Z]/.test(control.value);
      const hasLower = /[a-z]/.test(control.value);
      const hasSpecialCharacter = /[!@#$%^&*.]/.test(control.value);

      const valid = hasNumber && hasUpper && hasLower && hasSpecialCharacter;
      if (!valid) {
        return { weekPassword: true };
      }
    }
    return null;
  }
}
