import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ProcessService } from '@app/service/process.service';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.css']
})
export class OperationComponent implements OnInit {
  @Input() operation: any;
  editOpSapName: boolean = false;
  @ViewChild('inputOpeSapName') inputSapName: ElementRef<HTMLInputElement>;
  constructor(private processService: ProcessService) { }

  ngOnInit(): void {
  }
  opSapRowOverAction(eventTarget: HTMLElement, operation: any) {
    // //console.log(eventTarget, operation);
  }
  editOperationAction() {
    // Si je suis en mode editer
    if (this.editOpSapName) {
      //console.log("J'étais en mode édition");
      // Si la valeur a changer
      if (this.operation.NOM_OPERATION != this.inputSapName.nativeElement.value) {
        //console.log("Le nom a changé");
        this.operation.NOM_OPERATION = this.inputSapName.nativeElement.value;
        this.processService.modifyOperationName(this.operation.ID_OPERATION, this.inputSapName.nativeElement.value).subscribe((res: any) => {

        });
      } else {
        //console.log("Le nom n'a pas changé");
      }
    }
    //console.log('switch mode');
    this.editOpSapName = !this.editOpSapName;
  }
}
