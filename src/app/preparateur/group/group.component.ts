import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ProcessService } from '@app/service/process.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  @Input() group: any;
  editGroupName: boolean = false;
  @ViewChild('inputGroupName') inputGroupName: ElementRef<HTMLInputElement>;
  @Output() notifySelectedStep = new EventEmitter();
  @Input() showDetails: boolean;
  @Input() classToAdd: string[];
  groupSelect: boolean = false;
  @Output() selectedSubOperation: any = new EventEmitter;
  constructor(private processService: ProcessService) { }

  ngOnInit(): void {
  }

  selectStepEvent(event: any) {
    this.notifySelectedStep.emit(event);
  }

  editGroupAction() {
    // Si je suis en mode editer
    if (this.editGroupName) {
      //console.log("J'étais en mode édition");
      // Si la valeur a changer
      if (this.group.NOM != this.inputGroupName.nativeElement.value) {
        //console.log("Le nom a changé");
        this.group.NOM = this.inputGroupName.nativeElement.value;
        this.processService.modifyGroupName(this.group.ID_GROUP, this.inputGroupName.nativeElement.value).subscribe((res: any) => {

        });
      } else {
        //console.log("Le nom n'a pas changé");
      }
    }
    //console.log('switch mode');
    this.editGroupName = !this.editGroupName;
  }
  toogleSelectGroup() {
    if (this.groupSelect) {
      this.groupSelect = false;
      this.showDetails = false;
    } else {
      this.groupSelect = true;
      this.showDetails = true;
    }

  }
  selectSubOpeEvent(subOpe: any) {
    this.selectedSubOperation.emit(subOpe);
  }
}
