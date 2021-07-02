import {
  AfterViewInit,
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
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
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
    if (!changes.scannedMat.firstChange) {
      console.log(changes.scannedMat.currentValue);
      this.materialAction(changes.scannedMat.currentValue);
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
          console.log(res, traca.prodTracaDetail.MAT);
          const MAT = traca.prodTracaDetail.MAT;
          this.tracas.prodTraca = res.prodTraca;
          traca.prodTracaDetail = {
            COMMENTAIRE: (res.prodTracaDetail.COMMENTAIRE) ? '' : res.prodTracaDetail.COMMENTAIRE,
            DATE_EXECUTION: res.prodTracaDetail.DATE_EXECUTION,
            ID_MATIERE: '3',
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
          console.log(res);
          const MAT = traca.prodTracaDetail.MAT;
          console.log(MAT);
          this.tracas.prodTraca = res[0];
          traca.prodTracaDetail = {
            COMMENTAIRE: (res[1].COMMENTAIRE) ? '' : res[1].COMMENTAIRE,
            DATE_EXECUTION: res[1].DATE_EXECUTION,
            ID_MATIERE: '3',
            ID_PROD_TRACA: res[1].ID_PROD_TRACA,
            ID_PROD_TRACA_MATIERE: res[1].ID_PROD_TRACA_MATIERE,
            ID_TRACA_MATIERE: res[1].ID_TRACA_MATIERE,
            SANCTION: res[1].SANCTION,
            MAT: { MAT }
          };
        });
    });
  }

  checkTracasStatus(): any {
    //                                   !!!!!!!!!!      a modifier      !!!!!!!!
    // Si c'est pas fait
    for (const traca of this.tracas) {
      if (!traca.prodTracaDetail.DATE_EXECUTION) {
        this.enableTraca();
        this.enableConf();
        return;
      }
    }
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

  materialAction(inputData: any) {
    const techData = {
      idMat: inputData[0],
      batchId: inputData[1]
    };
    console.log(this.tracas);
    // test si c'est une matière présente dans le step
    const traca = this.tracas.find(traca => traca.ARTICLE == techData.idMat);
    console.log(traca);
    if (traca) {
      const scanMaterial = this.materialService.isKnownMaterial(techData.idMat);
      if (scanMaterial) {
        scanMaterial.then((data: any) => {
            console.log(data);
            this.materialService.getMatDetails(techData.batchId).subscribe((res: any) => {
              // test si matière pérémiée
              if (new Date(res.DATE_DE_PEREMPTION) > new Date()) {
                traca.prodTracaDetail = {
                  ID_MATIERE: techData.batchId,
                  SANCTION: 1,
                  MAT: res
                };
                //couleur ligne
                document.getElementsByClassName(`${data.ID_MATIERE}`)[0].parentElement.classList.add('conf');
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
    }else{
      console.error(traca);
    }
  }

  alertePeremption(scannedMaterial: any) {
    console.log(scannedMaterial);
    const dialogRef = this.dialog.open(DialogMaterialShelflifeDateComponent, {
      data: { scannedMaterial: scannedMaterial }
    });
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
    })
  }
}
