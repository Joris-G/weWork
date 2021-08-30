import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToolService } from '@app/service/tool.service';
import { FormControl } from '@angular/forms';
import { UserService } from '@app/service/user.service';
import { ToolRequest } from '@app/_models/tool-request';
import { User } from '@app/_models/user';



@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit, OnChanges {

  @Input() toolRequest: ToolRequest;
  userReal = new FormControl('');
  requestUser = new FormControl('');
  selectedRealUser;
  selectedRequestUser;
  selectedRequestDate;
  selectedAffectedUser;
  @Input() editModeActive: boolean;
  requestDate = new FormControl('');
  toolingCom = new FormControl('');
  affectedUser = new FormControl('');
  toolTeam: User[];
  // tool: any;
  operators: any = [
    {
      id: 'test',
      nom: 'GRANGIER',
      prenom: 'Joris',
      matricule: '1',

    }
  ]
  usersList: any;
  @Output() updateList: EventEmitter<any> = new EventEmitter<any>();





  constructor(public sanitizer: DomSanitizer, private toolService: ToolService, private userService: UserService) { }


  ngOnInit(): void {
    this.userService.getUsersListByTeam(444).then((userTeamList:any[]) => {
      this.toolTeam = [];
      userTeamList.forEach(user => {
        this.toolTeam.push(new User(user));
      });

    })
  }


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    //  this.toolService.getToolBySapNumber().then(tool => {
    // this.tool = this.request.getTool();
    // console.log(this.tool);
    // });
    console.log(changes);
    this.toolingCom.setValue(this.toolRequest.getToolingNote());
    this.selectedRealUser = this.toolRequest.getRealUser();
  }

  updateRequestClick() {
    const test = this.toolRequest.requestDescription;
    console.log(test);
    // const test2 = this.toolRequest.requestDescription.replace(/<[^>]*>/g, '');
    // console.log(test2);
    // this.toolRequest.requestDescription.replace(/<[^>]*>/g, '');
    console.log(this.toolRequest);
    this.toolService.updateRequest(this.toolRequest).then((result:any) => {
      console.log(this.toolRequest);
      this.updateList.emit(result);
    });
  }

  finishRequestClick() {
    this.toolRequest.setStatus(3);
    this.toolRequest.setRequestor(this.toolRequest.getRequestor());
    this.toolRequest.setTool(this.toolRequest.getTool());
    this.toolRequest.setRealUser(this.userReal.value);
    this.toolRequest.setToolingNote(this.toolingCom.value);
    this.toolRequest.setRequestDescription(this.toolRequest.getRequestDescription().replace(/<[^>]*>/g, ''));
    this.toolService.updateRequest(this.toolRequest).then(result => {
      this.updateList.emit();
    });
  }

  switchEditMode() {
    this.editModeActive = !this.editModeActive;
    if (this.editModeActive) {
      this.userService.getUsersListByRole(1).then(res => {
        this.usersList = res;
        this.requestUser.setValue(this.toolRequest.getRequestor().idUser);
        this.affectedUser.setValue(this.toolRequest.getAffectedTo().idUser);
        console.log(this.requestUser, this.affectedUser);
      });
      this.requestDate.setValue(new Date(this.toolRequest.getRequestDate()));
    }
  }
}
