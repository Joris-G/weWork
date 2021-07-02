import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  tool: any;
  editor: Editor;
  html: 'text';
  constructor(public formBuilder: FormBuilder, private authService :AuthenticationService , private toolingService:ToolService) { }

  ngOnInit(): void {
    this.editor = new Editor();
    this.maintenanceImprovementToolForm = this.formBuilder.group({
      toolNumber: ['', [Validators.minLength(8)]],
      description: ['', [Validators.required]],
      dateBesoin: ['', [Validators.required]],
      requestor:[this.authService.currentUser],
      requestDate : [new Date()],
    });
  }
  get getControl(){
    return this.maintenanceImprovementToolForm.controls;
  }
  async onSubmit(){
    //console.log(this.maintenanceImprovementToolForm);
    //console.log('submit toolrequest');
    // this.tool = await this.toolingService.getTool(this.toolNumber.slice(2));
    await this.toolingService.addToolRequest(this.requestor.ID_UTILISATEUR,this.tool.ID_TOOL,this.description,this.dateBesoin);
    //console.log('toolRequest recorded');
  }
  get description(){return this.maintenanceImprovementToolForm.get('description').value;}
  get dateBesoin(){return this.maintenanceImprovementToolForm.get('dateBesoin').value;}
  get toolNumber():string{return this.maintenanceImprovementToolForm.get('toolNumber').value;}
  get requestor(){return this.maintenanceImprovementToolForm.get('requestor').value;}

  async controlTool(){
    this.toolingService.getTool(this.toolNumber.slice(2)).then((tool)=>{
      //console.log('good tool');
      this.tool = tool;
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
