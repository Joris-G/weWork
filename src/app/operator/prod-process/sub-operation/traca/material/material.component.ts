import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { MaterialService } from 'src/app/service/material.service';
import { TracaService } from 'src/app/service/traca.service';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit, OnChanges {
  @Input() tracas: any;
  @Input() matInput: any;
  @Input() enableTraca: boolean;
  // @ViewChild('inputQrCode') inputMat: ElementRef;
  @Input() subOperation: any;

  tracasArray = new FormArray([]);
  materialList: any;
  focusTool: any;

  constructor(private tracaService: TracaService, private materialService: MaterialService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.materialAction(changes.matInput.currentValue);
  }

  // ngAfterViewInit() {
  //   this.focusTool = setInterval(() => {
  //     this.inputMat.nativeElement.focus();
  //   }, 300);

  // }

  ngOnDestroy() {
    clearInterval(this.focusTool);
  }

  ngOnInit(): void {
    this.materialService.getMaterialList().subscribe((response: any) => {
      this.materialList = response;
      this.tracas.forEach((traca: any) => {
        this.addControl(traca);
      });
    });

  }

  addControl(traca: any) {
    this.tracasArray.push(new FormControl({
      idTraca: traca.ID_TRACA,
      idTracaMatiere: traca.ID_TRACA_MATIERE,
      article: traca.ARTICLE,
      designation: this.materialList.find(article => article.ARTICLE_SAP == traca.ARTICLE).DESIGNATION_SIMPLIFIEE,
      idMatiere: 0,
      sanction: 0
    }));
  }


  recordTraca(tracaControls: any) {
    tracaControls.forEach((traca: any, i: number) => {
      this.tracaService.saveTracaMatiere(traca, this.subOperation).subscribe((res: any) => {
        console.log(res);
        // this.tracas.TRACA_DETAILS.PROD_TRACA = '';
      })
    });

  }

  materialAction(techData: any) {
    const scanMaterial = this.materialService.isKnownMaterial(techData.refSap);
    if (scanMaterial) {
      scanMaterial.then((data: any) => {
        // test si c'est une matière
        if (document.getElementsByClassName(data.ARTICLE_SAP)) {
          // test si matière pérémiée
          this.materialService.getMatDetails(techData.id).subscribe((res: any) => {
            if (new Date(res.DATE_DE_PEREMPTION) > new Date()) {
              document.getElementsByClassName(`${data.ARTICLE_SAP}`)[0].parentElement.classList.add('conf');
              document.getElementsByClassName(`${data.ARTICLE_SAP}`)[0].innerHTML = `${res.NUMERO_DE_LOT}`;
              document.getElementsByClassName(`${data.ARTICLE_SAP}`)[1].innerHTML = `${res.DATE_DE_PEREMPTION}`;
              const controls: AbstractControl[] = this.tracasArray.controls;
              const tracaControl = controls.find(control => control.value.article == data.ARTICLE_SAP)
              tracaControl.value.idMatiere = techData.id;
              const dateToday = new Date();
              tracaControl.value.dateExecution = `${dateToday.getFullYear()}-${dateToday.getMonth()}-${dateToday.getDate()}`;
            } else {
              console.error(`Le produit est périmé`);
            }
          });
        }
      },
        error => {
        });
    } else {
      console.error("Ce n'est pas une matière connue dans l'application");

    }
  }
}

