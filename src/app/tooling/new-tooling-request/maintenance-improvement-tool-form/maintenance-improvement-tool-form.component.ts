import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '@app/service/authentication.service';
import { ToolService } from '@app/service/tool.service';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-maintenance-improvement-tool-form',
  templateUrl: './maintenance-improvement-tool-form.component.html',
  styleUrls: ['./maintenance-improvement-tool-form.component.css']
})
export class MaintenanceImprovementToolFormComponent implements OnInit {
  maintenanceImprovementToolForm:FormGroup;
  constForm: FormGroup;
  otherDatas:any = {};
  toolIdentificationNumber:FormControl = new FormControl('');
  tool: any;
  editor: Editor;
  html: 'text';
  constructor(public formBuilder: FormBuilder, private authService :AuthenticationService , private toolingService:ToolService) { }

  ngOnInit(): void {
    this.editor = new Editor();
    this.maintenanceImprovementToolForm = this.formBuilder.group({
      toolNumber: ['', [Validators.minLength(8)]],
      toolIdentificationNumber: [{ value: '', disabled: true }],
      description: ['', [Validators.required]],
      dateBesoin: ['', [Validators.required]],
      requestor:[this.authService.currentUser],
      requestDate : [new Date()],
    });

    this.constForm = this.formBuilder.group({
      requestor: [this.authService.currentUser],
      requestDate: [new Date()],
    });

  }
  get getControl(){
    return this.maintenanceImprovementToolForm.controls;
  }
  async onSubmit(){
    //console.log(this.maintenanceImprovementToolForm);
    //console.log('submit toolrequest');
    // this.tool = await this.toolingService.getTool(this.toolNumber.slice(2));
    const request=null;
    await this.toolingService.addToolRequest(request);
    // await this.toolingService.addToolRequest(this.requestor.ID_UTILISATEUR,this.tool.ID_TOOL,this.description,this.dateBesoin,3);
    //console.log('toolRequest recorded');
  }

  async controlTool(){
    this.toolingService.getToolBySapNumber(this.maintenanceImprovementToolForm.controls.toolNumber.value.slice(2)).then((tool:any)=>{
      console.log('good tool');
      this.tool = tool;
this.maintenanceImprovementToolForm.controls.toolIdentificationNumber.setValue(tool.IDENTIFICATION);
this.otherDatas.toolDesignation = tool.DESIGNATION;

    },
    ()=>{
      //console.log('bad tool');
    });
  }
  exportAsPdf(divToExport:string,fileName:string){
    //console.log(divToExport);
    const data:HTMLElement = document.getElementById(divToExport);
    //console.log(data);
    html2canvas(data,{scale:3}).then(canvas=>{
      let fileWidth = 297;
    let fileHeight = 210;

    const FILEURI = canvas.toDataURL('image/jpg',1)
    let PDF = new jsPDF('l', 'mm', 'a4');
    let position = 0;
    PDF.addImage(FILEURI, 'JPG', 0, 0, fileWidth, fileHeight)

    PDF.save(fileName);

    });
  }
  uploadImage(){
    //console.log('uploadImage start');

  }
}
