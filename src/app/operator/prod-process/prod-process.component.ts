import { Component, Input, OnChanges, OnInit, SimpleChanges, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { ProdProcessServiceService } from '@app/service/prod-process-service.service';
import { TracaService } from '@app/service/traca.service';
import { Observable } from 'rxjs';
import { MaterialService } from 'src/app/service/material.service';

@Component({
  selector: 'app-prod-process',
  templateUrl: './prod-process.component.html',
  styleUrls: ['./prod-process.component.css']
})
export class ProdProcessComponent implements OnInit, OnChanges {
  currentSubOperation: any;
  @Input() process: any;
  @Input() lastOpe: any;
  @ViewChild('drawer') drawer: any;
  sideNaveState:Boolean =false;
  constructor(private materialService: MaterialService, private prodProcessService: ProdProcessServiceService, private tracaService: TracaService) { }

  ngOnInit(): void {
    //console.log('init');
    this.currentSubOperation = this.lastOpe.opeDet;
    this.showSubOperation(this.currentSubOperation);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }
  toggleNav(){
    this.drawer.toggle();
  }
  updateProcess(updatedProcess) {
    this.process = updatedProcess;
    // this.prodProcessService.getAllTraca(this.process.ARTICLE.ARTICLE_SAP, this.process.process.prodProcess.ORDRE_FABRICATION).subscribe(res => {
    //   console.log(res);
    //   this.process = res;
    // });
  }

  upDateStep(event) {
    //console.log(event);
  }

  showSubOperation(subOperation: any) {
    this.currentSubOperation = subOperation;
  }
}
