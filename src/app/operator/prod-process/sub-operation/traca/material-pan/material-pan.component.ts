import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MaterialService } from 'src/app/service/material.service';
import { TracaService } from 'src/app/service/traca.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogMaterialShelflifeDateComponent } from '@app/shared/dialog/dialog-material-shelflife-date/dialog-material-shelflife-date.component';
import { AuthenticationService } from '@app/service/authentication.service';

@Component({
  selector: 'app-material-pan',
  templateUrl: './material-pan.component.html',
  styleUrls: ['./material-pan.component.css']
})
export class MaterialComponent implements OnInit, OnChanges {
  @Input() tracas: any;
  @Input() enabledTraca: boolean;
  // @ViewChild('inputQrCode') inputMat: ElementRef;
  @Input() currentStep: any;
  @Input() scannedMat: any;
  @ViewChild('inputMat') inputMat: ElementRef;


  focusTool: any;
  materialList: any;
  user: any;
  enabledConf: boolean;

  constructor(
    private tracaService: TracaService,
    private materialService: MaterialService,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes.scannedMat.currentValue);
    if (!changes.scannedMat.firstChange) {
      console.log(changes.scannedMat.currentValue);
      this.materialAction(changes.scannedMat.currentValue);
    }
    if (changes.enabledTraca) {
      console.log(this.enabledTraca);
    }
    // this.materialAction(changes.matInput.currentValue);
  }

  ngOnDestroy() {
    clearInterval(this.focusTool);
  }

  ngOnInit(): void {
    this.user = this.authenticationService.currentUser;
    this.checkTracasStatus();
  }

  ngAfterViewInit() {
    this.focusTool = setInterval(() => {
      if (!this.enableTraca) {
        this.inputMat.nativeElement.focus();
      }
    }, 300);
  }

  recordTraca() {
    this.tracas.forEach((traca: any, i: number) => {
      this.tracaService
        .saveTracaMatiere(traca, this.currentStep)
        .subscribe((res: any) => {
          // console.log(res, traca.prodTracaDetail.MAT);
          const MAT = traca.prodTracaDetail.MAT;
          this.tracas.prodTraca = res.prodTraca;
          traca.prodTracaDetail = {
            COMMENTAIRE: (res.prodTracaDetail.COMMENTAIRE) ? '' : res.prodTracaDetail.COMMENTAIRE,
            DATE_EXECUTION: res.prodTracaDetail.DATE_EXECUTION,
            ID_PROD_TRACA: res.prodTracaDetail.ID_PROD_TRACA,
            ID_PROD_TRACA_MATIERE: res.prodTracaDetail.ID_PROD_TRACA_MATIERE,
            ID_TRACA_MATIERE: res.prodTracaDetail.ID_TRACA_MATIERE,
            SANCTION: res.prodTracaDetail.SANCTION,
            MAT: MAT
          };
          this.checkTracasStatus();
        });
    });
  }

  updateTracaMatiere() {
    this.tracas.forEach((traca: any, i: number) => {
      this.tracaService
        .updateTracaMatiere(traca, this.user)
        .subscribe((res: any) => {
          //console.log(res);
          const MAT = traca.prodTracaDetail.MAT;
          //console.log(MAT);
          this.tracas.prodTraca = res[0];
          traca.prodTracaDetail = {
            COMMENTAIRE: (res[1].COMMENTAIRE) ? '' : res[1].COMMENTAIRE,
            DATE_EXECUTION: res[1].DATE_EXECUTION,
            ID_PROD_TRACA: res[1].ID_PROD_TRACA,
            ID_PROD_TRACA_MATIERE: res[1].ID_PROD_TRACA_MATIERE,
            ID_TRACA_MATIERE: res[1].ID_TRACA_MATIERE,
            SANCTION: res[1].SANCTION,
            MAT: { MAT }
          };
        });
    });
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
      console.log(traca);
      if (traca.prodTracaDetail.DATE_EXECUTION) { return true }
    }
  }

  isAnyTracaInit(): any {
    for (const traca of this.tracas) {
      console.log(traca.prodTracaDetail, traca);
      if (traca.prodTracaDetail.SANCTION != undefined) { return true }
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

  materialAction(inputData: any) {
    let techData:any;
    console.log(inputData);
    if (inputData.length <= 2) {
      techData = {
        idMat: inputData[0],
        batchId: inputData[1]
      };
    }

    console.log(this.tracas);
    // test si c'est une matière présente dans le step
    const traca = this.tracas.find(traca => traca.ARTICLE == techData.idMat);
    //console.log(traca);
    if (traca) {
      const scanMaterial = this.materialService.isKnownMaterial(techData.idMat);
      if (scanMaterial) {
        scanMaterial.then((data: any) => {
          console.log(data);
          this.materialService.getMatDetails(techData.batchId).subscribe((res: any) => {
            // test si matière pérémiée
            if (new Date(res.DATE_DE_PEREMPTION) > new Date()) {
              console.log(techData);
              traca.prodTracaDetail = {
                ID_MATIERE: techData.idMat,
                SANCTION: 1,
                MAT: res
              };
              //couleur ligne
              console.log(document.querySelector(`.idArticle${traca.prodTracaDetail.ID_MATIERE}`));
              document.querySelector(`.idArticle${traca.prodTracaDetail.ID_MATIERE}`).classList.add('conf');
              // document
              // .querySelector(`.${data.ID_MATIERE}`)
              // .innerHTML = `${res.NUMERO_DE_LOT}`;

              // document.querySelectorAll(
              //   `.${data.ID_MATIERE}`
              // )[1].innerHTML = `${res.DATE_DE_PEREMPTION}`;
              this.checkTracasStatus();
            } else {
              console.error(`Le produit est périmé`);
              this.alertePeremption(res);
            }
          });

        },
          error => {
            console.error(error);

          }
        );
      } else {
        console.error("Ce n'est pas une matière connue dans l'application");
      }
    } else {
      console.error(traca);
    }

  }

  alertePeremption(scannedMaterial: any) {
    //console.log(scannedMaterial);
    const dialogRef = this.dialog.open(DialogMaterialShelflifeDateComponent, {
      data: { scannedMaterial: scannedMaterial }
    });
    dialogRef.afterClosed().subscribe(data => {
      //////console.log(data);
    })
  }
}
