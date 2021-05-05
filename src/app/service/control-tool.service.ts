import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ControlTool } from '@app/_interfaces/control-tool';

@Injectable({
  providedIn: 'root'
})
export class ControlToolService {


  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {

  }
  getControlToolList() {
    return this.http.get(`${this.baseUrl}/getAllControlTool.php?`);
  }
  getControlToolName(idTypeECME:string){
    return this.http.get(`${this.baseUrl}/getControlToolName.php?idTypeECME=${idTypeECME}`);
  }

  getControlTool(techData: { idTypeECME: string; idECME: string; }): any {
    return this.http.get(`${this.baseUrl}/getControlTool.php?idECME=${techData.idECME}`);
  }

  getControlToolTypeList() {
    return this.http.get(`${this.baseUrl}/getAllControlToolType.php?`);
  }

  addTool(tool:ControlTool){

  }
  removeTool(){

  }

  updateTool(){

  }
}
