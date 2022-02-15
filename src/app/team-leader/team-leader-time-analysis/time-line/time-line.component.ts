import { Component, OnInit, Input, AfterViewInit, OnChanges, AfterViewChecked, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.css']
})
export class TimeLineComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked, AfterContentChecked {



  // @Input() process: any;
  @Input() processList: any;
  totalDuration: number;
  timeFromStart: number;
  ratio: number;
  indexChange: number = 0;
  lastIndexChecked: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.totalDuration = 0;


  }


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    // console.log('OnChanges');
    // console.log(changes);
    if (changes.processList) {
      this.indexChange = this.indexChange + 1;
      // this.setStepsProperties();
    }
  }


  ngAfterViewInit(): void {
    // console.log('afterViewInit');
    // this.setTotalDuration();
    //  this.setStepsProperties();

  }

  ngAfterContentChecked(): void {
    // console.log('AfterContentCheck');
  }


  ngAfterViewChecked(): void {
    // console.log('afterViewChecked');
    if(this.lastIndexChecked < this.indexChange){
      this.lastIndexChecked = this.indexChange;
      this.setTotalDuration();
      this.setStepsProperties();
      }
  }
  setLegendProperties(process:any,color:string): any {
    const divLegend: HTMLDivElement = document.querySelector(`#legend${process.process.prodProcess.ID_PROD_PROCESS}`);
    console.log(divLegend);
    if (divLegend) {
      // divLegend.style.width = this.calculateDuration(step.prodStep.CUMUL_TEMPS);
      divLegend.style.backgroundColor = color;
    }
  }


  setStepsProperties(): any {
    this.processList.forEach(process => {
      const color = `rgb(${getRandomInt(0, 255)},${getRandomInt(0, 255)},${getRandomInt(0, 255)})`;
      this.setLegendProperties(process,color);
      process.process.OPERATION_GROUP.forEach(opeGroup => {
        opeGroup.OPERATIONS_DETAILLEES.forEach(opeDet => {
          opeDet.STEPS.forEach(step => {
            if (step.prodStep.CUMUL_TEMPS) {
              // console.log(step);
              this.setStepProperties(step, color);
            }
          });
        });
      });
    });
  }


  setTotalDuration(): void {
    this.processList[0].process.OPERATION_GROUP.forEach(opeGroup => {
      opeGroup.OPERATIONS_DETAILLEES.forEach(opeDet => {
        opeDet.STEPS.forEach(step => {
          if (step.prodStep.CUMUL_TEMPS) {
            this.totalDuration = this.totalDuration + parseInt(step.prodStep.CUMUL_TEMPS)
          }
        });
      });
    });
    const divWidth: number = document.querySelector('.timeLine-content').clientWidth;
    console.log(divWidth);
    this.ratio = divWidth / this.totalDuration;
     console.log(`ratio : ${this.ratio}`);
  }


  setStepProperties(step: any, color: string): void {
    console.log(`prodStep${step.prodStep.ID_PROD_STEP}`);
    const divStep: HTMLDivElement = document.querySelector(`#prodStep${step.prodStep.ID_PROD_STEP}`);

    if (divStep) {
      divStep.style.width = this.calculateDuration(step.prodStep.CUMUL_TEMPS);
      divStep.style.backgroundColor = color;
      console.log(divStep);
    }
  }


  setOffset(step: any): void {

  }

  calculateDuration(stepDuration: any): string {
    // console.log('calculate width');
    // const startDate = new Date(step.prodStep.DATE_DEBUT).getTime();
    // const endDate = new Date(step.prodStep.DATE_FIN).getTime();
    // const strDurationWidth = `${((endDate - startDate) * this.ratio).toString()}px`;
    const duration: number = parseInt(stepDuration);
    console.log(duration);
    const length = duration * this.ratio;
    console.log(length);
    this.timeFromStart = this.timeFromStart + duration;
    const strDurationWidth = `${length.toString()}px`;
     console.log(strDurationWidth);
    return strDurationWidth;
  }


  calculateOffset(): string {
    console.log('calculate offset');
    const offset: number = this.timeFromStart * this.ratio;
    const strOffset = `${offset.toString()}px`
    return strOffset;
  }
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
