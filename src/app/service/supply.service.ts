import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplyService {
  getWorkorderInfo(workorder:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getWorkOrderInfo.php?workorder=${workorder}`);
  }
  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }

  launchWorkorder(articleSap:number,workorder:number, name=''){
    //console.log(`launch : ${articleSap} , ${workorder} , ${name}`);
    return this.http.get(`${this.baseUrl}/launchScript.php?typeOperation=workorder&articleSap=${articleSap}&of=${workorder}&name=${name}`);
  }
  workorderIsLaunch(workorder:number){
    return this.http.get(`${this.baseUrl}/launchScript.php?typeOperation=testWorkorder&of=${workorder}`);
  }
}
