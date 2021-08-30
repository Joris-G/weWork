import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuth } from '@app/_interfaces/users/user-auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { User } from '@app/_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: User;

  constructor(private http: HttpClient, private router:Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUserSubject.asObservable().subscribe(res=>{
      this.currentUser = new User(res);
    });

  }
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  // login(username, password) {
  login(user: UserAuth) {
    //console.log('login');
    return this.http.post<any>(`${environment.apiUrl}/authenticate.php`, { username: user.username, password: user.password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        //console.log('user stored');
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/app-login']);
    //console.log('logout');
  }

}
