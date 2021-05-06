import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/service/authentication.service';
import { ToolService } from '@app/service/tool.service';

@Component({
  selector: 'app-new-tooling-request',
  templateUrl: './new-tooling-request.component.html',
  styleUrls: ['./new-tooling-request.component.css']
})
export class NewToolingRequestComponent implements OnInit{

  userForm: FormGroup;
  tool: any;
  constructor(public formBuilder: FormBuilder, private authService :AuthenticationService , private toolingService:ToolService) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      toolNumber: ['', [Validators.required, Validators.minLength(8)]],
      description: ['', [Validators.required]],
      dateBesoin: ['', [Validators.required]],
      requestor:[this.authService.currentUser],
      requestDate : [new Date()],
    });


  }
  get getControl(){
    return this.userForm.controls;
  }
  async onSubmit(){
    console.log(this.userForm);
    console.log('submit toolrequest');
    // this.tool = await this.toolingService.getTool(this.toolNumber.slice(2));
    await this.toolingService.addToolRequest(this.requestor.ID_UTILISATEUR,this.tool.ID_TOOL,this.description,this.dateBesoin);
    console.log('toolRequest recorded');
  }
  get description(){return this.userForm.get('description').value;}
  get dateBesoin(){return this.userForm.get('dateBesoin').value;}
  get toolNumber():string{return this.userForm.get('toolNumber').value;}
  get requestor(){return this.userForm.get('requestor').value;}


  async controlTool(){
    this.toolingService.getTool(this.toolNumber.slice(2)).then((tool)=>{
      console.log('good tool');
      this.tool = tool;
    },
    ()=>{
      console.log('bad tool');
    });
  }
}
