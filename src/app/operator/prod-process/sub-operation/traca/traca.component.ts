import { AfterContentInit, Component, Input, OnChanges, OnInit, SimpleChanges, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-traca',
  templateUrl: './traca.component.html',
  styleUrls: ['./traca.component.css']
})
export class TracaComponent implements OnInit, AfterContentInit, OnChanges {
  @Input() tracaList: any;
  @Input() step: any;
  @Input() currentStep: any;
  alertList = new Array(0);
  enable: boolean;
  @Input() tracaInput: any;
  role: any;
  prodProcess: any;




  @Input() prodTracaStep: any;
  @Input() processTracaStep: any;
  scannedMat: any;
  scannedOf: any;
  scannedTool: any;
   @Output()inputAutoFocusStatus: any = new EventEmitter<any>();

  constructor() {

  }
  toggleQrCodeInputAutoFocus(event){
    //console.log(event);
    this.inputAutoFocusStatus.emit(event);
  }
  displayQualityConnexion(eventTarget) {
    eventTarget.innerHTML = 'Scannez votre badge pour vous indentifier';
    this.enable = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes.tracaInput.firstChange){
//console.log(changes.tracaInput);
switch (changes.tracaInput.currentValue.type) {
  case 'MAT':
    this.scannedMat = changes.tracaInput.currentValue.data;
    break;
    case 'OF':
    this.scannedOf = changes.tracaInput.currentValue.data;
    break;
    case 'CTRL-TOOL':
    this.scannedTool = changes.tracaInput.currentValue.data;
    break;
  default:
    break;
}
    }
  }

  ngAfterContentInit(): void {
    // this.alertService.observable.subscribe(event => {
    //   this.loadNewAlertComponent(event);
    // });
  }

  ngOnInit(): void {
    // this.enable = !this.tracaList.prodTraca;
//console.log(this.tracaList, this.currentStep);
    this.role = this.tracaList.ROLE;
    if (this.tracaList.prodTraca !=false) {
    this.enable = false;
     }
     //console.log(this.enable);

    // this.alertService.observable.subscribe(event => {
    //   this.loadNewAlertComponent(event);
    // });
  }
  tracaDone(event) {
    if (event) {
      this.enable = !this.enable;
      this.tracaList.prodTraca = true;
    }
  }

}
