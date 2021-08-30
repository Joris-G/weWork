import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '@app/service/authentication.service';
import { ToolService } from '@app/service/tool.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Editor } from 'ngx-editor';
import { UserService } from '@app/service/user.service';
import { resolve } from 'q';
import { ProgramService } from '@app/service/program.service';
import { ToolRequest, ToolRequestType } from '@app/_models/tool-request';
import { Tool } from '@app/_models/tool';
import { User } from '@app/_models/user';

@Component({
  selector: 'app-new-tool-form',
  templateUrl: './new-tool-form.component.html',
  styleUrls: ['./new-tool-form.component.css']
})
export class NewToolFormComponent implements OnInit {

  newToolForm: FormGroup;
  constForm: FormGroup;
  tool: Tool;
  editor: Editor;
  html: 'text';
  enabled: boolean = true;
  otSapNotKnown: boolean = false;
  // toolIdentifNumber:FormControl = new FormControl('test', this.otSapNotKnown,Validators.required);
  // toolIdentifNumber: FormControl = new FormControl({ value: 'test', disabled: this.otSapNotKnown, validators: Validators.required });
  programlist: any;
  chargeAffaireList: any;
  chargeAffaire: { NOM: string; };
  request: ToolRequest;


  isFormComplete: boolean = false;


  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private toolingService: ToolService,
    private userService: UserService,
    private programService: ProgramService) {
    this.programService.getAllPrograms().then(programList => {
      this.programlist = programList;
      console.log(this.programlist);
    });
  }


  ngOnDestroy(): void {
    this.editor.destroy();

  }

  ngOnInit(): void {

    this.newToolForm = this.formBuilder.group({
      toolNumber: ['', [Validators.required, Validators.minLength(8)]],
      toolIdentificationNumber: [{ value: '', disabled: true }],
      aircraftProgramId: [{ value: '', disabled: true }],
      description: ['', Validators.required],
      dateBesoin: ['', Validators.required],
    });

    this.constForm = this.formBuilder.group({
      requestor: [this.authService.currentUser],
      requestDate: [new Date()],
    });


    this.userService.getUsersListByRole(4).then(res => {
      console.log(res);
      this.chargeAffaireList = res;
    });
    this.editor = new Editor();
  }


  async onSubmit() {
    console.log('submit toolrequest');
    console.log(this.newToolForm);
    console.log(this.constForm);
    this.request = new ToolRequest();
    this.request.idToolRequest = null;
      this.request.requestDate = this.constForm.controls.requestDate.value;
      this.request.requestor = this.constForm.controls.requestor.value;
      this.request.type = ToolRequestType.SBO;
      this.request.tool = this.tool;
      this.request.requestDescription = this.newToolForm.controls.description.value;
      this.request.imgName = '';
      this.request.needDate = new Date(this.newToolForm.controls.dateBesoin.value);
      console.log(this.tool);
      console.log(this.userService);
      this.request.affectedTo = this.userService.userList.find(user => isAffectationUser(user, this.tool.aircraftProgram.idProgram));
      this.request.status = 1;
      this.request.toolingNote = '';
    console.log(this.request);
    await this.toolingService.addToolRequest(this.request).then(res => {
      console.log('toolRequest recorded');
      this.newToolForm.reset({toolIdentificationNumber:'',toolNumber:'', description:''});
      this.request = null;
      resolve();
    });
    // await upload Image
  }

  async controlTool(elem) {
    this.toolingService.getToolBySapNumber(this.newToolForm.controls.toolNumber.value.slice(2)).then((tool: any) => {
      console.log('good tool', tool);
      this.tool = new Tool(tool)
      this.newToolForm.controls.toolIdentificationNumber.setValue(this.tool.identification);
      this.newToolForm.controls.aircraftProgramId.setValue(this.tool.aircraftProgram.idProgram);
      this.otSapNotKnown = false;
    },
      () => {
        this.otSapNotKnown = true;
        console.log('bad tool');
      });
  }


  exportAsPdf(divToExport: string, newToolControls: any) {
    console.log(divToExport,newToolControls);
    const saveFileName = `${newToolControls.toolIdentificationNumber.value}_${newToolControls.toolNumber.value}_Spécification de besoin outillage`;
    const data: HTMLElement = document.getElementById(divToExport);
    console.log(data);
    html2canvas(data, { scale: 3 }).then(canvas => {
      let fileWidth = 297;
      let fileHeight = 210;
      const FILEURI = canvas.toDataURL('image/jpg', 1)
      let PDF = new jsPDF('l', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'JPG', 0, 0, fileWidth, fileHeight)
      PDF.save(saveFileName);
    });
  }


  uploadImage() {
    console.log('uploadImage start');

  }


  testSelectionChange(event) {
    console.log(event.value);
    this.chargeAffaire = { NOM: 'Monsieur Test' }
  }


  testOTSyntaxe(event: any) {
    console.log(event);
  }
}


function isAffectationUser(user:User, idProgram) {
  return (user.program == idProgram && user.role.idRole == 8)
}
