import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {



  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }
getAllProcessesList(): Observable<any>{
  return this.http.get(`${this.baseUrl}/getAllProcessesList.php?`);
}

  modifyOperationName(idOperation: number, name: string) {
    return this.http.get(`${this.baseUrl}/modifyProcess.php?toMod=operationName&idOperation=${idOperation}&newNom=${name}`);
  }

  modifyGroupName(idGroup: any, name: string) {
    return this.http.get(`${this.baseUrl}/modifyProcess.php?toMod=groupName&idGroup=${idGroup}&newNom=${name}`);
  }

  modifySubOperationName(idSubOpe: any, name: string) {
    return this.http.get(`${this.baseUrl}/modifyProcess.php?toMod=subOpName&idSubOp=${idSubOpe}&newNom=${name}`);
  }

  modifyInstruction(idStep: any, instruction: string) {
    return this.http.get(`${this.baseUrl}/modifyProcess.php?toMod=instructionText&idStep=${idStep}&newInstruction=${instruction}`);
  }
}
