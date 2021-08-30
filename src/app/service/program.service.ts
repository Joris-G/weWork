import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AircraftProgram } from '@app/_models/aircraft-program';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  baseUrl = environment.apiUrl;
  programList: AircraftProgram[] = [];
  constructor(private http: HttpClient) {
  }

  async getAllPrograms() {
    //console.log(`tool : ${sapNumber} , ${designation} , ${version}`);
    return new Promise((resolve, reject) => {
      this.http.get(`${this.baseUrl}/program.php?typeOperation=getAllPrograms`)
        .subscribe((res:any[]) => {
          res.forEach(programRes=>{
            const program = new AircraftProgram(programRes);
            this.programList.push(program);
          })
          resolve(res);
        })
    });
  }

  getProgramById(idProgram:string):any {
    //console.log(`tool : ${sapNumber} , ${designation} , ${version}`);
    return new Promise((resolve, reject) => {
      this.http.get(`${this.baseUrl}/program.php?typeOperation=getProgramById&idProgram=${idProgram}`)
        .subscribe(res => {
          resolve(res);
        })
    });
  }
}
