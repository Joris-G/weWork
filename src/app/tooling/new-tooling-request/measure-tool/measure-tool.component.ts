import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/service/authentication.service';
import { ToolService } from '@app/service/tool.service';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-measure-tool',
  templateUrl: './measure-tool.component.html',
  styleUrls: ['./measure-tool.component.css']
})
export class MeasureToolComponent implements OnInit {
  measureToolForm: FormGroup;
  tool: any;
  editor: Editor;
  html: 'text';
  constructor(public formBuilder: FormBuilder,private authService :AuthenticationService,private toolingService:ToolService) { }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
  ngOnInit(): void {
    this.editor = new Editor();
    this.measureToolForm = this.formBuilder.group({
      toolNumber: ['', [Validators.required, Validators.minLength(8)]],
      description: ['', [Validators.required]],
      dateBesoin: ['', [Validators.required]],
      requestor:[this.authService.currentUser],
      requestDate : [new Date()],
    });
  }
  get getControl(){
    return this.measureToolForm.controls;
  }
  async onSubmit(){
    console.log(this.measureToolForm);
    console.log('submit toolrequest');
    // this.tool = await this.toolingService.getTool(this.toolNumber.slice(2));
    await this.toolingService.addToolRequest(this.requestor.ID_UTILISATEUR,this.tool.ID_TOOL,this.description,this.dateBesoin);
    console.log('toolRequest recorded');
  }
  get description(){return this.measureToolForm.get('description').value;}
  get dateBesoin(){return this.measureToolForm.get('dateBesoin').value;}
  get toolNumber():string{return this.measureToolForm.get('toolNumber').value;}
  get requestor(){return this.measureToolForm.get('requestor').value;}

  async controlTool(){
    this.toolingService.getTool(this.toolNumber.slice(2)).then((tool)=>{
      console.log('good tool');
      this.tool = tool;
    },
    ()=>{
      console.log('bad tool');
    });
  }
  exportAsPdf(divToExport:string,fileName:string){
    console.log(divToExport);
    const data:HTMLElement = document.getElementById(divToExport);
    console.log(data);
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
    console.log('uploadImage start');

  }
}
