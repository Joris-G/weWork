import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '@app/service/authentication.service';
import { ToolService } from '@app/service/tool.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Editor } from 'ngx-editor';
import { UserService } from '@app/service/user.service';
import { resolve } from 'q';

@Component({
  selector: 'app-new-tool-form',
  templateUrl: './new-tool-form.component.html',
  styleUrls: ['./new-tool-form.component.css']
})
export class NewToolFormComponent implements OnInit {
  newToolForm: FormGroup;
  tool: any;
  editor: Editor;
  html: 'text';
  enabled: boolean = true;
  otSapNotKnown: boolean = false;
  // toolIdentifNumber:FormControl = new FormControl('test', this.otSapNotKnown,Validators.required);
  toolIdentifNumber: FormControl = new FormControl({ value: 'test', disabled: this.otSapNotKnown, validators: Validators.required });
  list: any = ['ELEVATOR G600', 'A350 MLGD'];
  chargeAffaireList: any;
  chargeAffaire: { NOM: string; };

  constructor(public formBuilder: FormBuilder, private authService: AuthenticationService, private toolingService: ToolService, private userService: UserService) { }
  ngOnDestroy(): void {
    this.editor.destroy();

  }
  ngOnInit(): void {

    this.userService.getUsersListByRole(4).then(res => {
      console.log(res);
      this.chargeAffaireList = res;
    });
    this.editor = new Editor();
    this.newToolForm = this.formBuilder.group({
      toolNumber: ['', [Validators.required, Validators.minLength(8)]],
      toolIdentificationNumber: [''],
      aircraftProgramId: [''],
      description: ['', [Validators.required]],
      dateBesoin: ['', [Validators.required]],
      requestor: [this.authService.currentUser],
      requestDate: [new Date()],
    });
    console.log(this.newToolForm.controls.toolIdentificationNumber);
    this.newToolForm.controls.toolIdentificationNumber.disable();
    // this.newToolForm.controls.toolIdentificationNumber.enable();
    // this.newToolForm.addControl('toolIdentifNumber',this.toolIdentifNumber);
  }
  get getControl() {
    return this.newToolForm.controls;
  }
  async onSubmit() {
    console.log(this.newToolForm);
    console.log('submit toolrequest');
    // this.tool = await this.toolingService.getTool(this.toolNumber.slice(2));
    await this.toolingService.addToolRequest(this.requestor.ID_UTILISATEUR, this.tool.ID_TOOL, this.description, Date.parse(this.dateBesoin), 1).then(res => {
      console.log('toolRequest recorded');
      resolve();
    });
  }
  get description() { return this.newToolForm.get('description').value; }
  get toolIdentificationNumber() { return this.newToolForm.get('toolIdentificationNumber').value; }
  get aircraftProgramId() { return this.newToolForm.get('aircraftProgramId').value; }
  get dateBesoin() { return this.newToolForm.get('dateBesoin').value; }
  get toolNumber(): string { return this.newToolForm.get('toolNumber').value; }
  get requestor() { return this.newToolForm.get('requestor').value; }

  async controlTool(elem) {
    this.toolingService.getTool(this.toolNumber.slice(2)).then((tool:any) => {
      console.log('good tool', tool);
      this.tool = tool;
      this.newToolForm.controls.toolIdentificationNumber.setValue(tool.IDENTIFICATION);
      this.otSapNotKnown = false;
    },
      () => {
        this.otSapNotKnown = true;
        console.log('bad tool');
      });
  }
  exportAsPdf(divToExport: string, fileName: string) {
    console.log(divToExport);
    const data: HTMLElement = document.getElementById(divToExport);
    console.log(data);
    html2canvas(data, { scale: 3 }).then(canvas => {
      let fileWidth = 297;
      let fileHeight = 210;

      const FILEURI = canvas.toDataURL('image/jpg', 1)
      let PDF = new jsPDF('l', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'JPG', 0, 0, fileWidth, fileHeight)

      PDF.save(fileName);

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
