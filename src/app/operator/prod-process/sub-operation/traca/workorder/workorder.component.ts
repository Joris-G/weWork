import { Component, ElementRef, Input, OnInit, ViewChild, Output, EventEmitter, OnChanges } from '@angular/core';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { PartService } from 'src/app/service/part.service';
import { TracaService } from 'src/app/service/traca.service';
import { AuthenticationService } from '@app/service/authentication.service';
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
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (!changes.scannedOf.firstChange) {
      console.log(changes.scannedOf.currentValue);
      this.ofAction(changes.scannedOf.currentValue);
    }
  }
  @Input() tracas: any[];
  @Input() currentStep: any;
  @Output() emitTraca: any = new EventEmitter<any>();
  @Input() enabledTraca: boolean;
  @Input() scannedOf: any;
  focusTool: any;
  @ViewChild('inputOf') inputOf: ElementRef;
  user: any;
  enabledConf: boolean = false;

  constructor(private tracaService: TracaService,
    private partInfoService: PartService,
    private authenticationService: AuthenticationService, ) { }

  ngOnInit(): void {
    this.user = this.authenticationService.currentUser;
    this.checkTracasStatus();
  }

  addControl(traca: any) {
    const partInfo = this.partInfoService.getPartInfo(traca.ARTICLE)
    partInfo.subscribe((resp: any) => {
    })
  }
  checkTracasStatus(): any {
    console.log(this.tracas, this.user);
    //                        !!!!!!!!!!      a modifier      !!!!!!!!
    // Si c'est pas fait
    for (const traca of this.tracas) {
      if (!traca.prodTracaDetail.DATE_EXECUTION) {
        this.enableTraca();
        this.enableConf();
        console.log("c'est pas fait");
        return;
      }
    }
    console.log("c'est déjà fait");
    this.disableConf();
    //Si c'est fait
    if (this.user.ROLE != '3') {
      console.log('role permettant corriger la traça');
      this.enableTraca();
    } else {
      this.disableTraca();
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
    console.log(this.tracas, this.currentStep);
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

  ngAfterViewInit() {
    // this.focusTool = setInterval(() => {
    //   this.inputOf.nativeElement.focus();
    // }, 300);
  }

  ngOnDestroy() {
    // clearInterval(this.focusTool);
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
        console.log(this.tracas);
        if (this.tracas[tracaControl].prodTracaDetail) {
          //test si pas déjà assez de pièce
          if (this.tracas[tracaControl].QUANTITE == this.tracas[tracaControl].prodTracaDetail.OF.length) { return; }
          this.tracas[tracaControl].prodTracaDetail.OF.push(techData.of);
          console.log(this.tracas[tracaControl].prodTracaDetail);
        } else {

          this.tracas[tracaControl].prodTracaDetail = {
            OF: [techData.of],
            sanction : 1
           };
          console.log(this.tracas[tracaControl].prodTracaDetail);
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
