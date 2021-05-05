import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getPartInfo(partSapNumber: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getPartInfo.php?articleSap=${partSapNumber}`);
  }
  getAllPartChildren(refSap:number){
    return this.http.get(`${this.baseUrl}/getAllPartChildren.php?articleSap=${refSap}`);
  }
}
