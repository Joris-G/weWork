import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ControlToolService } from 'src/app/service/control-tool.service';
import { TracaService } from 'src/app/service/traca.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackMessageComponent } from '@app/tools/snack-message/snack-message.component';
import { AuthenticationService } from '@app/service/authentication.service';
import { DialogControlToolComponent } from '@app/shared/dialog/dialog-control-tool/dialog-control-tool.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-autocontrole',
  templateUrl: './autocontrole.component.html',
  styleUrls: ['./autocontrole.component.css']
})
export class AutocontroleComponent implements OnInit, OnChanges {
  @Input() tracas: any[];
  @Input() step: any;
  @Input() enabledTraca: boolean;
  @Input() currentStep: any;
  @Output() emitTraca: any = new EventEmitter<any>();
  @Output() emitCommentAreaStatus: any = new EventEmitter<any>();
  @ViewChild('commentArea') commentArea: ElementRef;
  @Input() scannedTool: any;
  // focusTool: any;
  toolList: any;
  tracaList: any = [];
  listenIddle: any;
  durationInSeconds: number = 5;
  user: any;
  enabledConf: boolean;


  constructor(
    private controlToolService: ControlToolService,
    private tracaService: TracaService,
    private _snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.scannedTool) {
      if (!changes.scannedTool.firstChange) {
        // console.log(changes.scannedTool.currentValue);
        this.toolAction(changes.scannedTool.currentValue);
      }
    }
  }

  ngOnInit(): void {
    console.log(`init autocontrole`, this.currentStep);
    this.user = this.authenticationService.currentUser;
    this.checkTracasStatus();
  }



  clickCommentAreaAction() {
    // console.log("try emit 'true'");
    this.emitCommentAreaStatus.emit(true);
  }

  blurCommentAreaAction() {
    // console.log("try emit 'false'");
    this.emitCommentAreaStatus.emit(false);
  }

  ngOnDestroy() {
    // this.deleteFocusInput();
  }

  getState(): boolean {
    return this.enabledTraca;
  }
  confClick(truc, traca) {
    console.log('conf click');
    if (!this.isTracaRecorded()) {
      console.log(traca.prodTracaDetail);
      if (!!traca.prodTracaDetail.ECME) {
        traca.prodTracaDetail = {
          SANCTION: 1,
          COMMENTAIRE: '',
          ECME: {
            NUMERO_ECME: ""
          }
        }
      }
      else {
        traca.prodTracaDetail.SANCTION = 1;
        traca.prodTracaDetail.COMMENTAIRE = '';
      }
      this.checkTracasStatus();
    }

  }

  nonConfClick(truc, traca) {
    console.log('nc click');
    if (!this.isTracaRecorded()) {
      console.log(traca.prodTracaDetail);

      if (!!traca.prodTracaDetail.ECME) {
        traca.prodTracaDetail = {
          SANCTION: 0,
          COMMENTAIRE: '',
          ECME: {
            NUMERO_ECME: "",
          },
        }
      }
      else {
        traca.prodTracaDetail.SANCTION = 0;
        traca.prodTracaDetail.COMMENTAIRE = '';
      }
      this.checkTracasStatus();
    }
  }

  checkTracasStatus(): void {
    console.log(this.tracas);
    //                                   !!!!!!!!!!      a modifier      !!!!!!!!
    if (this.isTracaRecorded()) {
      console.log(`Traça is Recorded`);
      if (this.user.ROLE == '2') {
        console.log('role permettant corriger la traça');
        this.enableTraca();
      } else {
        console.log(`Role ne permettant pas de corriger`);
        this.disableTraca();
      }
      this.enableConf();
    } else if (this.isAnyTracaInit()) {
      console.log(`%cTraça initiée`, "color : red");
      this.enableTraca();
    } else {
      console.log(`Traça jamais initiée`);
      this.disableTraca();
      this.enableConf();
    }


  }


  isTracaRecorded(): boolean {
    for (const traca of this.tracas) {
      if (traca.prodTracaDetail.DATE_EXECUTION) { return true }
    }
  }

  isAnyTracaInit(): any {
    for (const traca of this.tracas) {
      if (traca.prodTracaDetail.SANCTION) { return true }
    }
  }

  disableConf(): any {
    this.enabledConf = false;
  }

  enableConf(): any {
    this.enabledConf = true;
  }

  disableTraca(): void {
    this.enabledTraca = false;
  }

  enableTraca(): void {
    this.enabledTraca = true;
  }

  addComment(traca, eventTarget) {
    this.emitCommentAreaStatus.emit(false);
    traca.prodTracaDetail.COMMENTAIRE = eventTarget;
  }

  recordTraca() {
    this.tracas.forEach(element => {
      element.prodTracaDetail
    });
    this.tracas.forEach((traca: any, i: number) => {
      // console.log(traca, this.currentStep, this.step);
      this.tracaService
        .saveTracaControl(traca, this.currentStep)
        .subscribe((res: any) => {
          // console.log('emit', res);
          traca.prodTracaDetail = res.prodTracaDetail;
          // this.enableTraca = false;
          this.emitTraca.emit(true);
          this.checkTracasStatus();
        });
    });
  }

  updateTraca() {
    // console.log(this.tracas, this.currentStep, this.step);
    this.tracaService
      .updateTracaControl(this.tracas, this.currentStep, this.user)
    // .then((res) => {
    //   console.log('emit', res);
    //   // this.enableTraca = false;
    //   this.emitTraca.emit(true);

    // });
  }

  toolAction(scanInput: any) {
    // console.log(scanInput);
    // TEST SI c'est un outil de contrôle
    const techData = {
      idTypeECME: scanInput[0],
      idECME: scanInput[1]
    };
    //Test si c'est un outil
    const scannedTool = this.controlToolService.getControlTool(techData);
    scannedTool.subscribe((tool: any) => {
      // console.log(tool);
      if (tool) {
        //Test si c'est le bon type d'outil
        const traca = this.tracas.find(
          traca => traca.ID_TYPE_ECME == techData.idTypeECME
        );
        // console.log(traca);
        let indexTraca: any;
        if (traca) {
          indexTraca = this.tracas.findIndex(
            traca => traca.ID_TYPE_ECME == techData.idTypeECME
          );
          // console.log(indexTraca);
          // test si outil à la bonne date de validité
          if (new Date(tool.DATE_VALIDITE) >= new Date()) {
            const aujourdhui = new Date();
            const dans2Semaines = new Date(aujourdhui.setDate(aujourdhui.getDate() + 14));
            if (new Date(tool.DATE_VALIDITE) <= dans2Semaines) {
              this.alertECME('warning', tool, "La date de validité de l'outil est bientôt dépassée. Veuillez prévenir le contrôleur");
              console.error(tool, "La date de validité de l'outil est bientôt dépassée. Veuillez prévenir le contrôleur");
            }
            this.updateECME(traca, tool, indexTraca);
            document.getElementById(traca.ID_TYPE_ECME).parentElement.classList.add('conf');
            document.getElementById(traca.ID_TYPE_ECME).innerHTML = tool.NUMERO_ECME;

            // console.log(this.tracas);
          } else {
            this.alertECME('error', tool, "La date de validité de l'outil est dépassée. Veuillez utiliser un outil conforme");
            console.error(tool, "La date de validité de l'outil est dépassée. Veuillez utiliser un outil conforme");
          }
          // const controls: AbstractControl[] = this.tracasArray.controls;
          // const tracaControl = controls.find(control => control.value.article == part.ARTICLE_SAP)
          // if (tracaControl.value.recordedOf) {
          //   tracaControl.value.recordedOf.push(techData.idECME);
          // } else {
          //   tracaControl.value.recordedOf = [techData.idECME];
          // }
          // tracaControl.value.sanction = 1;
          // console.log(tracaControl.value.recordedOf);
          // const dateToday = new Date();
          // tracaControl.value.dateExecution = `${dateToday.getFullYear()}-${dateToday.getMonth()}-${dateToday.getDate()}`;

        } else {
          this.alertECME('error', tool, "Ce n'est pas un outil à utiliser pour ce step");
          console.error("Ce n'est pas un outil à utiliser pour ce step");
        }
      } else {
        this.alertECME('error', this.scannedTool, "Ce n'est pas un outil")
        console.error("Ce n'est pas un outil");
        // this.openSnackBar(`Ce n'est pas un outil à utiliser pour ce step`);
      }
    });
  }


  updateECME(traca, tool, indexTraca) {
    // console.log(traca, tool, indexTraca);
    // console.log(this.tracas[indexTraca]);
    this.tracas[indexTraca].prodTracaDetail = {
      COMMENTAIRE: '',
      SANCTION: (traca.prodTracaDetail) ? traca.prodTracaDetail.SANCTION : false,
      ECME: tool
    };
    this.checkTracasStatus();
    // console.log(this.tracas);
    // traca.prodTracaDetail = tool;
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackMessageComponent, {
      data: message,
      duration: this.durationInSeconds * 1000,
    });
  }

  alertECME(type: string, scannedTool: any, message: string) {
    // console.log(scannedTool);
    const dialogRef = this.dialog.open(DialogControlToolComponent, {
      data: {
        type: type,
        scannedTool: scannedTool,
        message: message
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      // console.log(data);
    })
  }

}
