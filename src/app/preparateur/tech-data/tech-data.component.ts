import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ProcessService } from '@app/service/process.service';

@Component({
  selector: 'app-tech-data',
  templateUrl: './tech-data.component.html',
  styleUrls: ['./tech-data.component.css']
})
export class TechDataComponent implements OnInit {
  @Input() subOperation: any;
  editInstruction: boolean = false;
  @ViewChild('inputInstruction') inputInstruction: ElementRef<HTMLInputElement>;
  @Output() selectedTabChange: EventEmitter<MatTabChangeEvent>
  constructor(private processService: ProcessService) { }

  ngOnInit(): void {
  }
  // editInstructionAction(step:any) {
  //   // Si je suis en mode editer
  //   if (this.editInstruction) {
  //     //console.log("J'étais en mode édition");
  //     // Si la valeur a changer
  //     if (this.step.INSTRUCTION.INSTRUCTION != this.inputInstruction.nativeElement.value) {
  //       //console.log("Le nom a changé");
  //       this.step.INSTRUCTION.INSTRUCTION = this.inputInstruction.nativeElement.value;
  //       this.processService.modifyInstruction(this.step.ID_STEP, this.inputInstruction.nativeElement.value).subscribe((res: any) => {

  //       });
  //     } else {
  //       //console.log("Le nom n'a pas changé");
  //     }
  //   }
  //   //console.log('switch mode');
  //   this.editInstruction = !this.editInstruction;
  // }
  editImgAction() {
    //console.log("coucou la compagnie");
  }
  tabChangeEvent(event: MatTabChangeEvent) {
    //console.log(event);
    if (event.tab.textLabel == "") {
      // this.processService.newStep()
    }
  }
}
