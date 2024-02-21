import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserService } from './user.service';
import { User } from '../data/user';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http: HttpClient = inject(HttpClient);
  userService: UserService = inject(UserService);
  toastr: ToastrService = inject(ToastrService);
  apiUrl: string = environment.apiUrl;

  get isLoggedIn(): boolean {
    if (localStorage) {
      if (localStorage.getItem('currentUser')) {
        return true;
      }
    }
    return false;
  }

  login(userName: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      let user = null;
      this.userService.getAllUsers().subscribe({
        next: (data: any) => {
          if (data.length) {
            user = data.find((user: any) => user.userName === userName && user.password === password);
            if (user) {
              localStorage.setItem('currentUser', JSON.stringify(user));
            }
          }
        },
        error: (err: any) => {
          debugger;
          this.toastr.error('There is an issue from API, Please contact the administrator!', 'API Error!');
          reject(err)
        },
        complete: () => resolve(user)
      });
    })
  }

  logout(): void {
    if (localStorage) {
      localStorage.removeItem('currentUser');
    }
  }

  get getLoggedUser(): User{
    return JSON.parse(localStorage.getItem('currentUser'));
  }
}
