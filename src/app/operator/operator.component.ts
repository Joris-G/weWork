import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ProdProcessServiceService } from '@app/service/prod-process-service.service';
import { TracaService } from '@app/service/traca.service';
import {
  GroupSubOpe,
  Operation,
  Process,
  SubOperation
} from '@app/_interfaces/process';

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.css']
})
export class OperatorComponent implements OnInit, AfterViewInit {
  @Input() scanInput: any;
  process: any;
  processReady: boolean = false;
  lastOpe: {
    opSAP: any;
    groupOpe: any;
    opeDet: any;
  };

  constructor(private prodProcessService: ProdProcessServiceService) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {}

  async getScanedInput(input: any) {
    await this.prodProcessService.getAllTraca(input[1], input[0]);
    this.process = this.prodProcessService.getProcess();
    console.log(this.process);
    if (!this.process.process.prodProcess) {
      await this.initProcess(input[0]);
    } else {
      for (const groupOpe of this.process.process.OPERATION_GROUP) {
        if (this.lastOpe) break;
        for (const opeDet of groupOpe.OPERATIONS_DETAILLEES) {
          if (this.lastOpe) break;
          if (opeDet.prodSubOperation.DATE_FIN == null) {
            this.lastOpe = {
              opSAP: groupOpe,
              groupOpe: groupOpe,
              opeDet: opeDet
            };
            //console.log('last Ope' , this.lastOpe);
            break;
          }
        }
      }
    }
    this.process = this.prodProcessService.getProcess();
    this.processReady = true;
  }


  async initProcess(workorder: number) {
    await this.prodProcessService.launchOperation(
      this.process.process.ID_OPERATION
    );
    await this.prodProcessService.startProdProcess(
      this.process.process,
      workorder
    );
    // await this.prodProcessService.launchSubOperation(
    //   this.process.process.OPERATION_GROUP[0].OPERATIONS_DETAILLEES[0],
    //   this.process.process.prodProcess
    // );
    this.lastOpe = {
      opSAP: this.process.process.OPERATION_GROUP[0],
      groupOpe: this.process.process.OPERATION_GROUP[0],
      opeDet: this.process.process.OPERATION_GROUP[0][
        'OPERATIONS_DETAILLEES'
      ][0]
    };
    //console.log('last Ope' , this.lastOpe);
  }
}
