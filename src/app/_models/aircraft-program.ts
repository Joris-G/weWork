import { ProgramService } from '@app/service/program.service';

export class AircraftProgram {
  idProgram:number;
  idClient:number;
  program:string;

  constructor(resRequest:any){
    this.idProgram= resRequest.ID_PROGRAMME_AVION;
    this.idClient = resRequest.ID_CLIENT;
    this.program = resRequest.PROGRAM;
  }



}
