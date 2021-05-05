import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplyService {
  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }

  launchWorkorder(articleSap:number,workorder:number, name=''){
    console.log(`launch : ${articleSap} , ${workorder} , ${name}`);
    return this.http.get(`${this.baseUrl}/launchScript.php?typeOperation=workorder&articleSap=${articleSap}&of=${workorder}&name=${name}`);
  }
  workorderIsLaunch(workorder:number){
    return this.http.get(`${this.baseUrl}/launchScript.php?typeOperation=testWorkorder&of=${workorder}`);
  }
}
