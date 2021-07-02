import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToolRequest } from '@app/tooling/work-list/work-list.component';

@Injectable({
  providedIn: 'root'
})
export class ToolService {
  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }

  addTool(sapNumber:number,designation:string, version:number=1){
    //console.log(`tool : ${sapNumber} , ${designation} , ${version}`);
    return new Promise((resolve,reject)=>{
      this.http.get(`${this.baseUrl}/tooling.php?typeOperation=addTool&sapNumber=${sapNumber}&designation=${designation}&version=${version}`)
      .subscribe(res=>{
        resolve(res);
      })
    });
  }

  addToolRequest(requestor:number, idTool:number,description:string,needDate:number){
    //console.log(`request : ${requestor} , ${idTool},${description},${needDate}`);
    return new Promise((resolve,reject)=>{
      this.http.get(`${this.baseUrl}/tooling.php?typeOperation=addToolRequest&requestor=${requestor}&idTool=${idTool}&description=${description}&needDate=${needDate}`)
      .subscribe(res=>{
        resolve(res);
      });
    });
  }

getTool(sapNumber:string){
  //console.log(`cherche Outillage : ${sapNumber}`);
  return new Promise((resolve,reject)=>{
    this.http.get(`${this.baseUrl}/tooling.php?typeOperation=getTool&sapNumber=${sapNumber}`)
    .subscribe(res=>{
      (res) ? resolve(res) : reject();
    });
  });
}

getToolRequestList(){
  //console.log(`get toolRequestList`);
  return new Promise((resolve,reject)=>{
    this.http.get(`${this.baseUrl}/tooling.php?typeOperation=getToolRequestList`)
    .subscribe((res)=>{
      (res) ? resolve(res) : reject();
    });
  });
}
async getToolsList(){
  return new Promise((resolve,reject)=>{
    this.http.get(`${this.baseUrl}/tooling.php?typeOperation=getToolsList`)
    .subscribe((res)=>{
      (res) ? resolve(res) : reject();
    });
  });
}

updateAffectation(request:ToolRequest,newAffectation:any){
  //console.log(request,newAffectation);
  return new Promise((resolve,reject)=>{
    this.http.get(`${this.baseUrl}/tooling.php?typeOperation=updateRequestAffectation&idRequest=${request.id}&affectation=${newAffectation}`)
    .subscribe((res)=>{
      (res) ? resolve(res) : reject();
    });
  });
}
}
