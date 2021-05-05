import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ProcessService } from '@app/service/process.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sub-ope',
  templateUrl: './sub-ope.component.html',
  styleUrls: ['./sub-ope.component.css']
})
export class SubOpeComponent implements OnInit {

  @Input() subOpe: any;
  editSubOpName: boolean = false;
  @ViewChild('inputSubOpName') inputSubOpName: ElementRef<HTMLInputElement>;
  stepSelect: boolean = false;
  selectedStep: any;
  @Output() stepEmitter = new EventEmitter;

  constructor(private processService: ProcessService) { }

  ngOnInit(): void {
  }

  editSubOpeAction() {
    // Si je suis en mode editer
    if (this.editSubOpName) {
      //console.log("J'étais en mode édition");
      // Si la valeur a changer
      if (this.subOpe.DESCRIPTION_OPERATION != this.inputSubOpName.nativeElement.value) {
        //console.log("Le nom a changé");
        this.subOpe.DESCRIPTION_OPERATION = this.inputSubOpName.nativeElement.value;
        this.processService.modifySubOperationName(this.subOpe.ID_OPERATION, this.inputSubOpName.nativeElement.value).subscribe((res: any) => {

        });
      } else {
        //console.log("Le nom n'a pas changé");
      }
    }
    //console.log('switch mode');
    this.editSubOpName = !this.editSubOpName;
  }

  stepAction(step: any) {
    if (this.stepSelect) {
      if (this.selectedStep == step) {
        this.selectedStep = null;
        this.stepSelect = false;
      } else {
        this.stepSelect = true;
        this.selectedStep = step;
      }
    } else {
      this.stepSelect = true;
      this.selectedStep = step;
    }
    this.stepEmitter.emit(this.selectedStep);
  }
}
