import { Component, ElementRef, Input, OnInit, ViewChild, Output, EventEmitter, OnChanges } from '@angular/core';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { PartService } from 'src/app/service/part.service';
import { TracaService } from 'src/app/service/traca.service';
import { AuthenticationService } from '@app/service/authentication.service';
import { User } from '@app/_models/user';
/**
 *
 *
 * @export
 * @class WorkorderComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-workorder',
  templateUrl: './workorder.component.html',
  styleUrls: ['./workorder.component.css']
})

export class WorkorderComponent implements OnInit, OnChanges {


  @Input() tracas: any[];
  @Input() currentStep: any;
  @Output() emitTraca: any = new EventEmitter<any>();
  @Input() enabledTraca: boolean;
  @Input() scannedOf: any;
  @ViewChild('inputOf') inputOf: ElementRef;
  user: User;
  enabledConf: boolean = false;
  isRecorded: boolean;


  constructor(private tracaService: TracaService,
    private partInfoService: PartService,
    private authenticationService: AuthenticationService, ) { }

  ngOnInit(): void {
    this.user = this.authenticationService.currentUser;
    this.checkTracasStatus();
  }


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log(changes);
    if (changes.scannedOf ?.firstChange == false) {
      // console.log(changes.scannedOf.currentValue);
      this.ofAction(changes.scannedOf.currentValue);
    }
  }


  addControl(traca: any) {
    const partInfo = this.partInfoService.getPartInfo(traca.ARTICLE);
    partInfo.subscribe((resp: any) => {
    });
  }


  checkTracasStatus(): any {
    // console.log(this.tracas);
    //                        !!!!!!!!!!      a modifier      !!!!!!!!
    // Si c'est pas fait
    if (this.isTracaRecorded()) {
      // console.log(`Traça is Recorded`);
      if (this.user.role.idRole == 2) {
        // console.log('role permettant corriger la traça');
        this.enableTraca();
      } else {
        // console.log(`Role ne permettant pas de corriger`);
        this.disableTraca();
      }
      this.enableConf();
    } else if (this.isAnyTracaInit()) {
      // console.log(`%cTraça initiée`, "color : red");
      this.enableTraca();
    } else {
      // console.log(`Traça jamais initiée`);
      this.disableTraca();
      this.enableConf();
    }
  }


  isTracaRecorded(): boolean {
    for (const traca of this.tracas) {
      console.log(traca);
      if (traca.prodTracaDetail.DATE_EXECUTION == undefined) {
        console.log('is traca recorded false');
        this.isRecorded = false;
        return false;
      }
    }
    this.isRecorded = true;
    return true;
  }


  isAnyTracaInit(): boolean {
    for (const traca of this.tracas) {
      if (traca.prodTracaDetail.SANCTION != undefined) {
        console.log('is any traca init false');
        return true;
      }
    }
    return false;
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


  recordTraca() {
    this.tracas.forEach((traca: any, i: number) => {
      this.tracaService.saveTracaOf(traca, this.currentStep).subscribe((res: any) => {
        if (!this.currentStep.TRACAS[0].prodTraca) {
          this.currentStep.TRACAS[0].prodTraca = res.prodTraca;
        }
        this.currentStep.TRACAS[0].TRACA_DETAILS[i].prodTracaDetail = res.prodTracaDetail;
        this.emitTraca.emit(true);
        this.checkTracasStatus();
      });
    });
  }


  updateTraca() {
    // console.log(this.tracas, this.currentStep);
    this.tracas.forEach(traca => {
      this.tracaService
        .updateTracaOf(traca, this.user);
      // .then((res) => {
      //   console.log('emit', res);
      //   // this.enableTraca = false;
      //   this.emitTraca.emit(true);

      // });
    });
  }


  ofAction(scanInput: any) {
    const techData = {
      refSap: scanInput[0],
      of: scanInput[1]
    }
    const scanPart = this.partInfoService.getPartInfo(techData.refSap);
    if (scanPart) {
      scanPart.subscribe((part: any) => {
        // test si c'est une pièce de l'assemblage
        const tracaControl = this.tracas.findIndex(control => control.ARTICLE == part.ARTICLE_SAP);
        // console.log(this.tracas);
        if (this.tracas[tracaControl].prodTracaDetail) {
          //test si pas déjà assez de pièce
          if (this.tracas[tracaControl].QUANTITE == this.tracas[tracaControl].prodTracaDetail.OF.length) { return; }
          this.tracas[tracaControl].prodTracaDetail.OF.push(techData.of);
          // console.log(this.tracas[tracaControl].prodTracaDetail);
        } else {

          this.tracas[tracaControl].prodTracaDetail = {
            OF: [techData.of],
            sanction: 1
          };
          // console.log(this.tracas[tracaControl].prodTracaDetail);
        }
        if (this.tracas[tracaControl].QUANTITE == this.tracas[tracaControl].prodTracaDetail.OF.length) { this.tracas[tracaControl].prodTracaDetail.SANCTION = 1; }
        this.checkTracasStatus();
      });
    } else {
      console.error("Ce n'est pas une pièce connue dans l'application");
    }
  }


  toggleDelete(event: HTMLElement) {
    //change image
    if (event.getAttribute('src') == 'assets/img/poub_daher_rouge-03.png') {
      event.setAttribute('src', 'assets/img/poub_daher_bleue-03.png');
      event.parentElement.parentElement.classList.remove('delete');
    } else {
      event.setAttribute('src', 'assets/img/poub_daher_rouge-03.png');
      event.parentElement.parentElement.classList.add('delete');

    }

    //rayer la ligne

  }


  removeOf(traca: any) {
    traca.prodTracaDetail.OF = [];
    traca.prodTracaDetail.SANCTION = 0;
  }
}
