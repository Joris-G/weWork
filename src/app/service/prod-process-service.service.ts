import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdProcessServiceService {


  baseUrl = environment.apiUrl;
  process: any;
  constructor(private http: HttpClient) { }

  getProcess(): any {return this.process}

  getAllTraca(codifProcess: string, workorder: number){
    return new Promise((resolve,reject)=>{
      this.http.get(`${this.baseUrl}/getProcess.php?codifProcess=${codifProcess}&OF=${workorder}`).subscribe(res=>{
        if(res){
          console.log(res);
          this.process = res;
          resolve(res)
        }
      });
    });
  }
  getAllProcesses(articleSap: string) {
    return this.http.get(`${this.baseUrl}/getAllProcesses.php?articleSap=${articleSap}`);
  }

  isProd(): boolean {
    return (this.process.prodProcess);
  }
  isProdOpe(prodProcess: any): boolean {
    return (prodProcess.operations);
  }
  isProdSubOpe(operation: any): boolean {
    return (operation.subOperations);
  }
  isProdStep(subOperations): boolean {
    return (subOperations.steps);
  }
  isTraca(step): boolean {
    return (step.traca);
  }

  launchProcess(process: any, workorder: number) {
    return this.http.get(
      `${this.baseUrl}/launchScript.php?typeOperation=process&idProcess=${process.ID_PROCESS}&of=${workorder}$name=${name}`
    );
  }

  startProdProcess(process: any, workorder: number) {
    return new Promise ((resolve,rejetc)=>{
      this.http.get(`${this.baseUrl}/launchScript.php?typeOperation=prodProcess&idProcess=${process.ID_PROCESS}&workorder=${workorder}`).subscribe(res=>{
        this.process.process.prodProcess = res;
        resolve(res);
      });
    })

  }

  startPointOperation: Date;
  endPointOpeartion: Date;

  initOperationTimer() {
    this.startPointOperation = new Date();
    //console.log('start timer operation');
  }

  stopOperationTimer(prodOperation: any) {
    this.endPointOpeartion = new Date();
    //console.log('end timer operation');
    // this.addOperationTime(prodOperation);
  }
  launchOperation(idOperation: any) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `${this.baseUrl}/launchScript.php?typeOperation=ope&idOperation=${idOperation}`
        )
        .subscribe(res => {
          if (res) resolve(res);
        });
    });
    // return this.http.get(`${this.baseUrl}/launchScript.php?typeOperation=ope&idProdProcess=${prodProcess.ID_PROD_PROCESS}&idOperation=${operation.ID_OPERATION}`);
  }

  launchSubOperation(subOperation: any, prodProcess: any) {
    //console.log('launchSubOperation service', subOperation, prodOperation);
    return new Promise((resolve,reject)=>{
      console.log(subOperation);
      this.http.get(
        `${this.baseUrl}/launchScript.php?typeOperation=subOpe&idProdProcess=${this.process.process.prodProcess.ID_PROD_PROCESS}&idSubOpe=${subOperation.ID_SUB_OPERATION}`
      ).subscribe(res=>{
        resolve(res);
      });
    })

  }

  launchStep(step: any, prodSubOpe: any) {
    //console.log(prodSubOpe.prodSubOperation);
    return new Promise((resolve,reject)=>{
      this.http.get(
        `${this.baseUrl}/launchScript.php?typeOperation=step&idProdSubOperation=${prodSubOpe.prodSubOperation.ID_PROD_SUBOP}&idStep=${step.ID_STEP}`
      ).subscribe(res=>{
        resolve(res);
      });
    })

  }
}
