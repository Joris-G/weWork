import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdProcessServiceService {

  startPointSubOperation: Date;
  endPointSubOpeartion: Date;
  startPointStep: Date;
  endPointStep: Date;
  baseUrl = environment.apiUrl;
  process: any;
  constructor(private http: HttpClient) { }

  getProcess(): any {return this.process}

  getAllTraca(codifProcess: string, workorder: number){
    // console.log(`getAllTraca sans vérifier la donnée codif process`);
    return new Promise((resolve,reject)=>{
      this.http.get(`${this.baseUrl}/getProcess.php?codifProcess=${codifProcess}&OF=${workorder}`).subscribe(res=>{
        if(res){
          //console.log(res);
          this.process = res;
          resolve(res)
        }
      });
    });
  }

  deleteAllTraca(codifProcess: string, workorder: number){
    return new Promise((resolve,reject)=>{
      this.http.get(`${this.baseUrl}/deleteTraca.php?codifProcess=${codifProcess}&OF=${workorder}`).subscribe(res=>{
        if(res){
          //console.log(res);
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
    });

  }

  initSubOperationTimer() {
    this.startPointSubOperation = new Date();
    // console.log('start timer operation');
  }


  stopSubOperationTimer(subOperation: any) {
    // console.log('end timer operation', subOperation);
    this.endPointSubOpeartion = new Date();

    // console.log(this.endPointSubOpeartion.getTime() - this.startPointSubOperation.getTime());
    this.addSubOperationTime(subOperation.prodSubOperation).then((res:any)=>{
      subOperation.prodSubOperation = res;
    })
  }



  initStepTimer() {
    this.startPointStep = new Date();
    // console.log('start timer step');
  }


  stopStepTimer(step: any) {
    // console.log('end timer step', step);
    this.endPointStep = new Date();

    // console.log(this.endPointStep.getTime() - this.startPointStep.getTime());
    this.addStepTime(step.prodStep).then((res:any)=>{
      step.prodStep = res;
    })
  }


  addSubOperationTime(prodSubOperation: any) {
    const previousTime : number = Number.parseInt(prodSubOperation.CUMUL_TEMPS);
    // console.log(previousTime);
    const cumulTime:number = previousTime + (this.endPointSubOpeartion.getTime() - this.startPointSubOperation.getTime());
    //  console.log(cumulTime);
    return new Promise ((resolve,rejetc)=>{
      this.http.get(`${this.baseUrl}/launchScript.php?typeOperation=addTimeSubOperation&idProdSubOpe=${prodSubOperation.ID_PROD_SUBOP}&cumulTemps=${cumulTime}`).subscribe(res=>{
        // this.process.process.prodProcess = res;
        resolve(res);
      });
    });
  }

  addStepTime(prodStep: any) {
    const previousTime : number = Number.parseInt(prodStep.CUMUL_TEMPS);
    // console.log(previousTime);
    const cumulTime:number = previousTime + (this.endPointStep.getTime() - this.startPointStep.getTime());
    // console.log(cumulTime);
    return new Promise ((resolve,rejetc)=>{
      this.http.get(`${this.baseUrl}/launchScript.php?typeOperation=addTimeStep&idProdStep=${prodStep.ID_PROD_STEP}&cumulTemps=${cumulTime}`).subscribe(res=>{
        // this.process.process.prodProcess = res;
        resolve(res);
      });
    });
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
    // console.log('launchSubOperation service', subOperation,prodProcess);
    return new Promise((resolve,reject)=>{
      //console.log(subOperation);
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
