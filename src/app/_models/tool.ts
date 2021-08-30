import { AircraftProgram } from './aircraft-program';

export class Tool {
  idTool:number;
  sapNumber:string;
  identification:string;
  designation:string;
  version:string;
  aircraftProgram:AircraftProgram;

  constructor(resRequest:any){
    console.log(resRequest);
    this.idTool=resRequest.ID_TOOL;
    this.sapNumber=resRequest.SAP_NUMBER;
    this.identification=resRequest.IDENTIFICATION;
    this.designation=resRequest.DESIGNATION;
    this.version=resRequest.VERSION;
    this.aircraftProgram = new AircraftProgram(resRequest);
  }
}
