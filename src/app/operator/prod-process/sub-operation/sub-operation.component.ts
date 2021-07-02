import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { TracaService } from '@app/service/traca.service';
import { AuthenticationService } from '@app/service/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackMessageComponent } from '@app/tools/snack-message/snack-message.component';
import { ProdProcessServiceService } from '@app/service/prod-process-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserListComponent } from '@app/shared/dialog/dialog-user-list/dialog-user-list.component';

@Component({
  selector: 'app-sub-operation',
  templateUrl: './sub-operation.component.html',
  styleUrls: ['./sub-operation.component.css'],
})
export class SubOperationComponent implements OnInit, AfterViewInit, OnChanges {
  tracaData: any;
  @ViewChild('inputQrCode') inputQr: ElementRef;
  focusTool: any;
  currentStep: any;
  @Input() currentSubOperation: any;
  @Input() process: any;
  @Input() currentOperation: any;
  @Output() toggleNavEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() nextStepEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateProcess: any = new EventEmitter<any>();
  coUsers: any = [];
  user: any;
  durationInSeconds = 5;
  enableAutoFocus: Boolean = true;
  confTraca: boolean;

  constructor(
    private _snackBar: MatSnackBar,
    private tracaService: TracaService,
    private authenticationService: AuthenticationService,
    private prodProcessService: ProdProcessServiceService,
    public dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('change');
    if (changes.currentSubOperation) {
      console.log(changes.currentSubOperation);
      console.log('current sub op change');
      this.launchSubOperation().then(() => {
        console.log('use current step');
        this.defineCurrentStep(this.currentStep);
      });
    }
    console.log('ici');
    // this.defineCurrentStep(changes.currentSubOperation.currentValue.STEPS[0]);
  }

  @ViewChild('MatTabGroup') tabGroup: MatTabGroup;

  defineCurrentStep(step: any): void;
  defineCurrentStep(step: number): void;
  defineCurrentStep(step: any): void {
    console.log(typeof step);
    switch (typeof step) {
      case 'object':
        this.currentStep = step;
        break;
      case 'number':
        this.currentStep = this.currentSubOperation.STEPS[step];
        break;
      default:
        break;
    }
    console.log(this.currentStep);

    if (this.currentStep.ORDRE != '1' && this.currentStep.prodStep == false) {
      console.log(1);
      this.launchStep(this.currentStep);
    }

  }
  setInputAutoFocus(event) {
    console.log(event);
    if (!event) {
      this.focusInputQrCode()
    } else {
      this.blurInputQrCode();
    }
  }

  ngOnInit(): void {
    console.log('init', this.currentStep, this.currentOperation, this.currentSubOperation);
    this.user = this.authenticationService.currentUser;
    this.coUsers.push(this.user);
    document.onkeydown = (ev) => {
      if (ev.keyCode == 39) {
        this.tabGroup.selectedIndex = (this.tabGroup.selectedIndex + 1);
      }
      if (ev.keyCode == 37) {
        this.tabGroup.selectedIndex = (this.tabGroup.selectedIndex - 1);
      }
    };

    setInterval(() => {
      if (this.enableAutoFocus) {
        this.inputQr.nativeElement.focus();
        // this.focusInputQrCode()
      }
    }, 300);
  }

  launchSubOperation() {
    return new Promise((resolve, reject): void => {
      //Si pas déjà débutée on lance la subOPE
      console.log(this.currentSubOperation);
      if (!this.currentSubOperation.prodSubOperation) {
        console.log("c'est ici qu'on a lancé  la subOPE!");
        //console.log(this.currentSubOperation, this.currentOperation);
        this.prodProcessService.launchSubOperation(this.currentSubOperation, this.currentOperation).then(res => {
          this.currentSubOperation.prodSubOperation = res;
          const firstStep = this.currentSubOperation.STEPS[0];
          this.currentStep = firstStep;
          console.log('first step', this.currentStep);
          if (this.currentStep.prodStep == false) {
            console.log(2);
            this.launchStep(firstStep).then((res) => {
              resolve(res);
            })
          }
        });
      }
      //Sinon on cherche la première step non réalisée
      else {
        for (const step of this.currentSubOperation.STEPS) {
          console.log(step);
          //Si la step n'est pas initiée
          if (step.prodStep == false) {
            console.log(3);
            this.launchStep(step).then((res) => {
              this.currentStep = step;
              console.log(this.currentStep);
            });

            break;
          } else if (step.prodStep.DATE_FIN == null) {
            console.log(4);
            this.currentStep = step;
            console.log(this.currentStep);
            break;
          }
        }
        // this.currentSubOperation.STEPS.forEach(step => {
        //   //Si la step n'est pas initiée
        //   if (!step.prodStep) {
        //     this.launchStep(step);
        //     this.currentStep = step;
        //   }
        // })
      }
      console.log(this.currentStep)
    });

    // resolve(this.currentStep);

  }

  launchStep(step: any) {
    console.log('step', step);
    return new Promise((resolve) => {
      this.prodProcessService.launchStep(step, this.currentSubOperation).then(res => {
        this.currentStep.prodStep = res;
        console.log("Lancement de la step", this.currentStep.prodStep);
        resolve(res);
      });
    })

  }




  ngAfterViewInit() {
    // this.focusTool = setInterval(() => {
    //   this.inputQr.nativeElement.focus();
    // }, 300);
    // document.addEventListener('click', (event) => {
    //   clearInterval(this.focusTool);
    // })
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackMessageComponent, {
      data: message,
      duration: this.durationInSeconds * 1000,
    });
  }


  confEvent() {
    //console.log(this.user);
    //console.log('on confirme la step' , this.currentStep);
    this.tracaService.confStep(this.currentStep, this.coUsers).subscribe(res => {
      console.log('step confirmée : ', res);
      const nativeStep = this.currentSubOperation.STEPS.find(nativeStep => nativeStep == this.currentStep);
      nativeStep.prodStep = res;
      //Test si dernière step de la suboperation
      const lastStep = this.currentSubOperation.STEPS.slice(-1);
      // console.log('dernière step de la subOpe : ' , lastStep);
      // test si toutes les steps de la sous opé sont validés

      if (this.checkStatus()) {

        // console.log("c'est la dernière step de la subOpe donc je confirme la subOpe");
        this.tracaService.confSubOperation(this.currentSubOperation).subscribe(res => {
          // console.log('subope confirmée : ', res);
          this.currentSubOperation.prodSubOperation = res
          this.openSnackBar('Sous opération enregistrée');
          //Test si dernière subOpe dans le groupe
        });
        //Définir le nouveau groupe
      } else {
        // TROUVER le step suivant
        //1. check si current STEP != dernier STEP
        console.log(this.currentStep);
        if (this.currentStep.ORDRE < this.currentSubOperation.STEPS.length) {
          const indexCurrentStep = this.currentSubOperation.STEPS.findIndex(testStep => testStep.ID_STEP == this.currentStep.ID_STEP)
          //Definir current Step == le step suivant
          // console.log("index step : " , indexCurrentStep);
          this.currentStep = this.currentSubOperation.STEPS[indexCurrentStep + 1];
          // console.log("nex step : ",this.currentStep);
          this.tabGroup.selectedIndex = (indexCurrentStep + 1);
        }
        // this.prodProcessService.launchStep(this.currentStep, this.currentSubOperation).then(res => {
        //   this.currentStep.prodStep = res;
        //   console.log(this.currentStep.prodStep);
        // });
        // this.nextStepEmitter.emit(this.currentSubOperation.STEPS[indexCurrentStep + 1]);
      }

      console.log("emit updateprocess");
      this.updateProcess.emit(this.currentSubOperation);
      // this.openSnackBar('Step enregistré');
    });
  }
  checkStatus(): Boolean {
    for (const step of this.currentSubOperation.STEPS) {
      if (!step.prodStep.DATE_FIN) return false;
    }
    return true;
  }






  inputAction(eventTarget: HTMLInputElement) {

    //console.log(eventTarget);
    const firstSpace = eventTarget.value.search(' ');
    const identifier = eventTarget.value.slice(0, firstSpace);
    console.log(identifier);
    if (identifier) {
      const inputDataScan = eventTarget.value.slice(firstSpace + 1).split(',');
      const techData = {
        type: identifier,
        data: inputDataScan
      }
      this.tracaData = techData
    } else {
      // console.log(inputDataScan[0]);
      switch (eventTarget.value) {
        case '1':
          this.confEvent();
          break;
        case '5':
          // this.connectSecondaryUser(inputDataScan[0]);
          break;
      }
    }
    eventTarget.value = "";
  }


  focusInputQrCode() {
    console.log('try focus');
    this.enableAutoFocus = true;
    this.inputQr.nativeElement.focus();
  }

  blurInputQrCode() {
    console.log('try blur');
    this.enableAutoFocus = false;
    this.inputQr.nativeElement.blur();
  }

  toggleNav() {
    this.toggleNavEmitter.emit();
  }
  addUserOnClick() {
    const dialogRef = this.dialog.open(DialogUserListComponent, {
      data: { coUsers: this.coUsers }
    });
    dialogRef.afterClosed().subscribe((data: []) => {
      console.log(data);
      this.coUsers = data;
      // data.map(user=>this.coUsers.push(user));
      // this.coUsers.push(data);
    })
  }
  /**
   *True si toute la traca est ok
   *False si au moins une traca est NC
   *
   * @return {*}  {Boolean}
   * @memberof SubOperationComponent
   */
  prodTracaStatus(stepTracas: any): Boolean {
    for (const traca of stepTracas) {
      for (const tracaDetail of traca.TRACA_DETAILS) {
        if (tracaDetail.prodTracaDetail.SANCTION == 0) {
          return false;
        };
      }
    }
    return true;
  }
  getStepColor(step): string {
    if (step.prodStep.DATE_FIN) {
      if (step.TRACAS) {
        if (this.prodTracaStatus(step.TRACAS)) {
          return 'rgb(0, 202, 61)';
        } else {
          return 'red';
        }
      }else {
        return 'rgb(0, 202, 61)';
      }
    }
    return 'inherit';
  }
}
