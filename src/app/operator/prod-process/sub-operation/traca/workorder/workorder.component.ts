import { Component, ElementRef, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { PartService } from 'src/app/service/part.service';
import { TracaService } from 'src/app/service/traca.service';
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

export class WorkorderComponent implements OnInit {
  @Input() tracas: any;
  @Input() currentStep: any;
  @Output() emitTraca: any = new EventEmitter<any>();
  tracasArray = new FormArray([]);
  focusTool: any;
  @ViewChild('inputOf') inputOf: ElementRef;

  constructor(private tracaService: TracaService, private partInfoService: PartService) { }

  ngOnInit(): void {
    console.log(this.currentStep);
    this.currentStep.TRACA.TRACA_DETAILS.forEach((traca: any) => {
      this.addControl(traca);
    });
  }

  addControl(traca: any) {
    const partInfo = this.partInfoService.getPartInfo(traca.ARTICLE)
    partInfo.subscribe((resp: any) => {
      this.tracasArray.push(new FormControl({
        idTraca: traca.ID_TRACA,
        idTracaOf: traca.ID_TRACA_OF,
        article: traca.ARTICLE,
        designation: resp.DESIGNATION,
        quantite: traca.QUANTITE,
        sanction: 0
      }));
    })
  }

  recordTraca(tracaControls: any) {
    tracaControls.forEach((traca: any, i: number) => {
      this.tracaService.saveTracaOf(traca, this.currentStep).subscribe((res: any) => {
        console.log(res);
        // tracaControls[i].value.prodTracaDetail = res;
        console.log(traca,tracaControls[i]);
        if(!this.currentStep.TRACA.prodTraca){
        this.currentStep.TRACA.prodTraca = res.prodTraca;
        }
        this.currentStep.TRACA.TRACA_DETAILS[i].prodTracaDetail = res.prodTracaDetail;
      })
    });
this.emitTraca.emit(true);
  }

  ngAfterViewInit() {
    this.focusTool = setInterval(() => {
      this.inputOf.nativeElement.focus();
    }, 300);
  }

  ngOnDestroy() {
    clearInterval(this.focusTool);
  }

  ofAction(scanInput: HTMLInputElement) {
    if (scanInput.value.startsWith('OF', 0)) {
      const inputDataScan = scanInput.value.slice(3).split(',');
      const techData = {
        refSap: inputDataScan[0],
        of: inputDataScan[1]
      }
      const scanPart = this.partInfoService.getPartInfo(techData.refSap);
      if (scanPart) {
        scanPart.subscribe((part: any) => {
          // test si c'est une pièce de l'assemblage
          if (document.getElementById(part.ARTICLE_SAP)) {
            // document.getElementById(part.ARTICLE_SAP).parentElement.classList.add('conf');

            const controls: AbstractControl[] = this.tracasArray.controls;
            const tracaControl = controls.find(control => control.value.article == part.ARTICLE_SAP)
            if (tracaControl.value.recordedOf) {
              tracaControl.value.recordedOf.push(techData.of);
            } else {
              tracaControl.value.recordedOf = [techData.of];
            }
            tracaControl.value.sanction = 1;
            console.log(tracaControl.value.recordedOf);
            // const dateToday = new Date();
            // tracaControl.value.dateExecution = `${dateToday.getFullYear()}-${dateToday.getMonth()}-${dateToday.getDate()}`;
          } else {
            console.error("Cette pièce ne semble pas faire partie de l'assemblage");

          }
        },
          error => {
          });
      } else {
        console.error("Ce n'est pas une pièce connue dans l'application");

      }
    } else {
      console.error("Ce n'est pas un OF");
    }
    scanInput.value = "";
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

  removeOf(control: FormControl) {
    control.value.dateExecution = "";
    control.value.recordedOf = "";
  }
}
