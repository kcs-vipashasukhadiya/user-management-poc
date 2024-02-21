import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subject, tap } from 'rxjs';
import { User } from '../data/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http: HttpClient = inject(HttpClient);
  apiUrl: string = environment.apiUrl;
  selectedUserId: number;
  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get(this.apiUrl + '/' + userId);
  }

  getLoggedUser(userName: string, password: string): any {
    return this.getAllUsers().subscribe({
      next: (data: any) => {
        if (data.length) {
          return data.find(user => user.userName === userName && user.password === password);
        }
      }
    });
  }

  getMaxUserId(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.getAllUsers().subscribe({
        next: (data: any) => {
          if (data.length) {
            resolve(Math.max(...data.map((a: any) => a.id)) + 1);
          }
        },
        error: (err: any) => { reject(err); }
      });
    });
  }

  postUser(user: User): Observable<any> {
    debugger;
    if (this.selectedUserId) {
      return this.http.put(this.apiUrl + '/' + this.selectedUserId, user).pipe(
        tap(() => this.refreshRequired.next())
      );
    }
    return this.http.post(this.apiUrl, user).pipe(
      tap(() => this.refreshRequired.next())
    );
  }

  patchUser(user: any): Observable<any> {
    return this.http.patch(this.apiUrl + '/' + this.selectedUserId, user).pipe(
      tap(() => this.refreshRequired.next())
    );
  }

  deleteUser(id: any) {
    return this.http.delete(this.apiUrl + '/' + id).pipe(
      tap(() => this.refreshRequired.next())
    );
  }
}
