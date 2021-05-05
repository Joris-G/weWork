import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from '@app/_interfaces/role';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) {
  }

  getRole(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/getAllRole.php?`);;
  }
}
