import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ElementRef,
  HostListener
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ControlToolService } from 'src/app/service/control-tool.service';
import { TracaService } from 'src/app/service/traca.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-autocontrole',
  templateUrl: './autocontrole.component.html',
  styleUrls: ['./autocontrole.component.css']
})
export class AutocontroleComponent implements OnInit, OnChanges {
  @Input() tracas: any[];
  @Input() step: any;
  @Input() enableTraca: boolean;
  @Input() currentStep: any;
  @Output() emitTraca: any = new EventEmitter<any>();
  @ViewChild('inputControlTool') inputOf: ElementRef;
  focusTool: any;
  toolList: any;
  tracaList: any = [];
  listenIddle: any;

  constructor(
    private controlToolService: ControlToolService,
    private tracaService: TracaService,
    private fb: FormBuilder
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    console.log(this.tracas);
    console.log(this.step);
  }

  ngOnInit(): void {}

  @HostListener('click', ['$event']) onClick(event : MouseEvent) {
    if(this.isInput(event)) {
      this.deleteFocusInput();
      this.endFocusDetection(event.target);
    }
  }
  endFocusDetection(target: EventTarget): any {
    let letFocusOnComment:boolean = false;
    target.addEventListener('keydown',()=>{
      console.log('keydown');
      letFocusOnComment = true;
    });
    target.addEventListener('click',()=>{
      console.log('click');
      letFocusOnComment = true;
    });
    target.addEventListener('change',()=>{
      console.log('change');
      letFocusOnComment = false;

    });
    target.addEventListener('input',()=>{
      console.log('input');
      letFocusOnComment = true;
    });

    this.listenIddle = setInterval(() => {
      if(!letFocusOnComment) {
        console.log("detection false");
        isIddle();
      }
      letFocusOnComment=false;
    }, 3000);
    const isIddle = ()=>{
      console.log('isIddle');
      this.focusOnInput();
      clearInterval(this.listenIddle);
    }
  }


  ngAfterViewInit() {
    this.focusOnInput();
  }
  focusOnInput(): any {
    console.log('focus auto Input');
    // this.listenIddle=null;
    this.focusTool = setInterval(() => {
      this.inputOf.nativeElement.focus();
    }, 300);
  }

  deleteFocusInput() {
    console.log('delete auto focus');
    clearInterval(this.focusTool);
  }

  isInput(event): boolean {
    if (event.target.nodeName == 'TEXTAREA') return true;
  }

  ngOnDestroy() {
    this.deleteFocusInput();
  }

  getState(): boolean {
    return this.enableTraca;
  }

  toggleConf(target: HTMLElement, traca: any) {
    target.classList.toggle('selected');
    if (target.classList.contains('ok')) {
      if (
        target.parentElement
          .querySelector('.nok')
          .classList.contains('selected')
      ) {
        target.parentElement.querySelector('.nok').classList.remove('selected');
      }
      traca.prodTracaDetail = { SANCTION: 1, COMMENTAIRE: '' };
    } else {
      if (
        target.parentElement.querySelector('.ok').classList.contains('selected')
      ) {
        target.parentElement.querySelector('.ok').classList.remove('selected');
      }
      traca.prodTracaDetail = { SANCTION: 0, COMMENTAIRE: '' };
    }
  }

  addComment(traca, eventTarget) {
    traca.prodTracaDetail.COMMENTAIRE = eventTarget;
  }

  recordTraca() {
    console.log(this.tracas);
    this.tracaService
      .saveTracaControl(this.tracas, this.currentStep)
      .then(() => {
        console.log('emit');
        // this.enableTraca = false;
        this.emitTraca.emit(true);
      });
  }

  toolAction(scanInput: HTMLInputElement) {
    console.log(scanInput);
    // TEST SI c'est un outil de contrôle
    if (scanInput.value.startsWith('CTRL-TOOL', 0)) {
      const inputDataScan = scanInput.value.slice(10).split(',');
      const techData = {
        idTypeECME: inputDataScan[0],
        idECME: inputDataScan[1]
      };
      //Test si c'est le bon type d'outil
      const traca = this.tracas.find(
        traca => traca.ID_TYPE_ECME == techData.idTypeECME
      );
      let indexTraca: any;
      if (traca) {
        indexTraca = this.tracas.findIndex(
          traca => traca.ID_TYPE_ECME == techData.idTypeECME
        );
      }
      if (traca) {
        const scannedTool = this.controlToolService.getControlTool(techData);
        if (scannedTool) {
          scannedTool.subscribe(
            (tool: any) => {
              // test si outil à la bonne date de validité
              console.log(tool);
              if (document.getElementById(tool.ID_TYPE_ECME)) {
                console.log("c'est le bon outil");
                document
                  .getElementById(tool.ID_TYPE_ECME)
                  .parentElement.classList.add('conf');
                document.getElementById(tool.ID_TYPE_ECME).innerHTML =
                  tool.NUMERO_ECME;
                this.updateECME(traca, tool, indexTraca);
                console.log(this.tracas);
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
                console.error(
                  "Cette pièce ne semble pas faire partie de l'assemblage"
                );
              }
            },
            error => {}
          );
        }
      } else {
        console.error("Ce n'est pas un outil à utiliser pour ce step");
      }
    } else {
      console.error("Ce n'est pas un outil de controle");
    }
    scanInput.value = '';
  }
  updateECME(traca, tool, indexTraca) {
    console.log(traca, tool, indexTraca);
    console.log(this.tracas[indexTraca]);
    this.tracas[indexTraca].prodTracaDetail = {
      COMMENTAIRE: '',
      SANCTION: 1,
      TOOL: tool
    };

    console.log(this.tracas);
    // traca.prodTracaDetail = tool;
  }
}
