import { Injectable, inject } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { UserService } from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AsyncValidatorService {
  userService = inject(UserService)

  userNameExists(): AsyncValidatorFn {
    return (control: any): Observable<{ [key: string]: boolean } | null> => {
      return this.userService.getAllUsers().pipe(
        map((res: any) => {
          if (control.value) {
            const IsUsernameExists = res.filter((req: any) => req.userName === control.value).length;
            if (IsUsernameExists && !this.userService.selectedUserId) {
              return { userNameExists: true };
            }
          }
          return null;
        })
      )
    }
  }

  emailIdExists(): AsyncValidatorFn {
    return (control: any): Observable<{ [key: string]: boolean } | null> => {
      return this.userService.getAllUsers().pipe(
        map((res: any) => {
          if (control.value) {
            const IsEmailIdExists = res.filter((req: any) => req.emailId === control.value).length;
            if (IsEmailIdExists && !this.userService.selectedUserId) {
              return { emailIdExists: true };
            }
          }
          return null;
        })
      )
    }
  }
}
