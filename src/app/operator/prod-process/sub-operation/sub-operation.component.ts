import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { TracaService } from '@app/service/traca.service';
import { AuthenticationService } from '@app/service/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackMessageComponent } from '@app/tools/snack-message/snack-message.component';
import { ProdProcessServiceService } from '@app/service/prod-process-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserListComponent } from '@app/shared/dialog/dialog-user-list/dialog-user-list.component';
import { User } from '@app/_models/user';
import { DialogTracaComponent } from '@app/shared/dialog/dialog-traca/dialog-traca.component';
import { DialogSimpleInfoComponent } from '@app/shared/dialog/dialog-simple-info/dialog-simple-info.component';

@Component({
  selector: 'app-sub-operation',
  templateUrl: './sub-operation.component.html',
  styleUrls: ['./sub-operation.component.css'],
})
export class SubOperationComponent implements OnInit, AfterViewInit, OnChanges {
  tracaData: any;
  @ViewChild('inputQrCode') inputQr: ElementRef<HTMLInputElement>;
  focusTool: any;
  @Input() currentStep: any;
  @Input() currentSubOperation: any;
  @Input() process: any;
  @Input() currentOperation: any;
  @Output() toggleNavEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() nextStepEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateProcess: any = new EventEmitter<any>();
  coUsers: User[] = [];
  user: User;
  durationInSeconds = 5;
  enableAutoFocus: Boolean = true;
  confTraca: boolean;


  kitParam: any[] = [];

  constructor(
    private _snackBar: MatSnackBar,
    private tracaService: TracaService,
    private authenticationService: AuthenticationService,
    private prodProcessService: ProdProcessServiceService,
    public dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('change');
    if (changes.currentSubOperation) {
      // console.log(changes.currentSubOperation);
      // console.log('current sub op change');
      this.launchSubOperation().then(() => {
        // console.log('use current step');
        this.defineCurrentStep(this.currentStep);
      });

    }

    // console.log('ici');
    // this.defineCurrentStep(changes.currentSubOperation.currentValue.STEPS[0]);
  }


  @ViewChild('MatTabGroup') tabGroup: MatTabGroup;

  defineCurrentStep(step: any): void;
  defineCurrentStep(step: number): void;
  defineCurrentStep(step: any): void {
    // console.log(typeof step);
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

    // console.log(this.currentStep);

    if (this.currentStep.ORDRE != '1' && this.currentStep.prodStep == false) {
      // console.log(1);
      this.launchStep(this.currentStep);
    }
    // console.log(this.currentStep);
  }
  setInputAutoFocus(event) {
    if (!event) {
      this.focusInputQrCode()
    } else {
      this.blurInputQrCode();
    }
  }

  ngOnInit(): void {
    // console.log('init', this.currentStep, this.currentOperation, this.currentSubOperation);
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
    // console.log(this.currentStep);
  }

  launchSubOperation() {
    return new Promise((resolve, reject): void => {
      //Si pas déjà débutée on lance la subOPE
      if (!this.currentSubOperation.prodSubOperation) {
        // console.log("c'est ici qu'on a lancé  la subOPE!");
        this.prodProcessService.launchSubOperation(this.currentSubOperation, this.currentOperation).then(res => {
          this.currentSubOperation.prodSubOperation = res;
          const firstStep = this.currentSubOperation.STEPS[0];
          this.currentStep = firstStep;
          // console.log('first step', this.currentStep);
          if (this.currentStep.prodStep == false) {
            this.launchStep(firstStep).then((res) => {
              resolve(res);
            })
          }
        });
      }
      //Sinon on cherche la première step non réalisée
      else {
        for (const step of this.currentSubOperation.STEPS) {
          //Si la step n'est pas initiée
          if (step.prodStep == false) {
            this.launchStep(step).then((res) => {
              this.currentStep = step;
              //  console.log(this.currentStep);
            });

            break;
          } else if (step.prodStep.DATE_FIN == null) {
            // console.log(4);
            this.currentStep = step;
            //  console.log(this.currentStep);
            break;
          }
        }
      }
      //  console.log(this.currentStep);
      this.prodProcessService.initStepTimer();
    });
  }

  launchStep(step: any) {
    // console.log('step', step);
    return new Promise((resolve) => {
      this.prodProcessService.launchStep(step, this.currentSubOperation).then(res => {
        this.currentStep.prodStep = res;
        // console.log("Lancement de la step", this.currentStep.prodStep);
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
    // console.log('on commence la confirmation de la step', this.currentStep);
    // console.log(`on test si la step a la traça d'enregistré`, this.currentStep);
    //Si pas enregistré
    if (!this.isTracaRecorded(this.currentStep.TRACAS)) {
      // Message d'alerte à l'opérateur qui demande de confirmer ou non l'action
      this.alertTraca('alerte', this.currentStep, "traçabilité n'est pas effectuée").then(onResolve => {
        //Si confirmé
        //On enregistre
        // console.log(`La réponse resolve`);
        this.recordStep();
      },
        onReject => {
          //Si pas confirmé
          //return
          // console.log(`La réponse reject`);
        });
    } else {
      this.recordStep();
    }
    //Si Enregistré
    // On enregistre

    //Enregistrement

  }

  isTracaRecorded(tracas: any): boolean {
    if (tracas) {
      for (const traca of tracas) {
        if (traca.prodTraca) {
          return true;
        } else {
          for (const tracaDetail of traca.TRACA_DETAILS) {
            if (tracaDetail.prodTracaDetail.SANCTION != undefined) {
              // console.log(`La traçabilité est renseignée mais non enregistrée. Voulez-vous l'enregistrer ?`);
              const dialogRef = this.dialog.open(DialogSimpleInfoComponent, {
                data: {
                  title: 'Alerte OF',
                  message: `La traçabilité est renseignée mais non enregistrée. Voulez-vous l'enregistrer ?`,
                  type: 'yesNo'
                }
              });
              dialogRef.afterClosed().subscribe(data => {
                console.log(data);
              })


            }

          }
          return false;
        }
      }

    } else {
      return true;
    }
  }

  alertTraca(type: string, currentStep: any, message: string) {
    return new Promise<void>((resolve, reject) => {
      const dialogRef = this.dialog.open(DialogTracaComponent, {
        data: {
          type,
          currentStep,
          message
        }
      });
      dialogRef.afterClosed().subscribe(response => {
        console.log(response);
        (response) ? resolve() : reject();
      });

    });

  }

  recordStep() {
    this.tracaService.confStep(this.currentStep, this.coUsers).subscribe(res => {
      const nativeStep = this.currentSubOperation.STEPS.find(nativeStep => nativeStep == this.currentStep);
      nativeStep.prodStep = res;
      //Test si dernière step de la suboperation
      const lastStep = this.currentSubOperation.STEPS.slice(-1);
      // test si toutes les steps de la sous opé sont validés

      if (this.checkStatus()) {

        this.tracaService.confSubOperation(this.currentSubOperation).subscribe(res => {
          this.currentSubOperation.prodSubOperation = res
          this.openSnackBar('Sous opération enregistrée');
          //Test si dernière subOpe dans le groupe
        });
        //Définir le nouveau groupe
      } else {
        // TROUVER le step suivant
        //1. check si current STEP != dernier STEP
        // console.log(this.currentStep);
        if (this.currentStep.ORDRE < this.currentSubOperation.STEPS.length) {
          const indexCurrentStep = this.currentSubOperation.STEPS.findIndex(testStep => testStep.ID_STEP == this.currentStep.ID_STEP)
          this.currentStep = this.currentSubOperation.STEPS[indexCurrentStep + 1];
          this.tabGroup.selectedIndex = (indexCurrentStep + 1);
        }
      }
      this.updateProcess.emit(this.currentSubOperation);
    });
  }





  checkStatus(): Boolean {
    for (const step of this.currentSubOperation.STEPS) {
      if (!step.prodStep.DATE_FIN) return false;
    }
    return true;
  }





  identifier: string;
  inputAction(eventTarget: HTMLInputElement) {
    if (this.kitParam.length > 0) {
      this.kitParam.push(this.inputQr.nativeElement.value.normalize().split(' : '));
      if (this.kitParam.length == 10) {
        this.tracaData = {
          type: this.identifier,
          data: this.kitParam
        }
      }

    } else {
      //console.log(eventTarget);
      const firstSpace = eventTarget.value.search(' ');
      this.identifier = eventTarget.value.slice(0, firstSpace);
      // console.log(identifier);
      if (this.identifier == 'OF' || this.identifier == 'MAT' || this.identifier == 'CTRL-TOOL') {
        const inputDataScan = eventTarget.value.slice(firstSpace + 1).split(',');
        this.tracaData = {
          type: this.identifier,
          data: inputDataScan
        }
      } else if (this.identifier == 'Kit') {
        this.kitParam.push(this.inputQr.nativeElement.value.normalize().split(' : '));
        this.inputQr.nativeElement.value = '';
      } else {
        // console.log(inputDataScan[0]);
        switch (eventTarget.value) {
          case '1':
            this.confEvent();
            break;
          case '5':
            // this.connectSecondaryUser(inputDataScan[0]);
            break;
          default:

            break;
        }

      }
    }
    this.inputQr.nativeElement.value = '';
  }


    focusInputQrCode() {
      // console.log('try focus');
      this.enableAutoFocus = true;
      this.inputQr.nativeElement.focus();
    }

    blurInputQrCode() {
      // console.log('try blur');
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
        // console.log(data);
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
          // console.log(tracaDetail.prodTracaDetail.SANCTION);
          if (!tracaDetail.prodTracaDetail.SANCTION) {
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
        } else {
          return 'rgb(0, 202, 61)';
        }
      }
      return 'inherit';
    }
  }
