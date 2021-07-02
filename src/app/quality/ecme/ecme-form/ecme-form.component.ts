import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ControlToolService } from '@app/service/control-tool.service';

@Component({
  selector: 'app-ecme-form',
  templateUrl: './ecme-form.component.html',
  styleUrls: ['./ecme-form.component.css']
})
export class EcmeFormComponent implements OnInit,OnChanges {
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.selectedType = this.selectedEcme.ID_TYPE_ECME;
    this.ecmeValidityDate = new Date(this.selectedEcme.DATE_VALIDITE);
  }

@Input()selectedEcme:any;

selectedType:any;
typeTool:any;
ecmeValidityDate:any;
  constructor(private controlToolService : ControlToolService) { }

  ngOnInit(): void {
    this.controlToolService.getControlToolTypeList().subscribe(res=>{
      this.typeTool = res;

    });
  }
  updateTool(){
    //console.log('updateTool', this.selectedEcme);
  }

}
