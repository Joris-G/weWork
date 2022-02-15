import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-sub-ope-group',
  templateUrl: './sub-ope-group.component.html',
  styleUrls: ['./sub-ope-group.component.css']
})
export class SubOpeGroupComponent implements OnInit, OnChanges {

  isTraca: boolean = false;
  tracaStatus: string;
  @Input() subOperation: any;
  @Input() currentSubOpe: any
  subOpeProdStatus: any;
  subOpeTracaStatus: any;
  active: boolean;
  constructor() { }

  ngOnInit(): void {
    this.setStatus();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.setStatus();
  }

  setStatus() {
    this.active = this.isActive(this.subOperation);
    this.subOpeProdStatus = this.getProdStatus();
    this.isTraca = this.isAnyTraca();
    if (this.isTraca) {
      this.tracaStatus = this.getTracaStatus();
    }
  }

  isActive(subOpeToTest: any): boolean {
    if (this.currentSubOpe.ID_SUB_OPERATION == subOpeToTest.ID_SUB_OPERATION) {
      return true;
    } else {
      return false;
    }
  }


  getProdStatus(): string {
    if (this.subOperation.prodSubOperation.DATE_FIN) {
      return '1'
    }
    if (this.subOperation.prodSubOperation.DATE_DEBUT) {
      return '2';
    }
    return '4';
  }

  isAnyTraca(): boolean {
    let response: boolean;
    if (!this.subOperation.STEPS) return false;
    for (const step of this.subOperation.STEPS) {
      // console.log(step);
      if (step.TRACAS) {
        return true;
      } else {
        response = false;
      }
    }
    return response;
  }

  getTracaStatus(): string {
    for (const step of this.subOperation.STEPS) {
      if (step.TRACAS) {
        for (const traca of step.TRACAS) {


          if (traca.prodTraca) {
            let score: number = 0;
            traca.TRACA_DETAILS.forEach(tracaDetailElement => {
              // console.log(tracaDetailElement);
              score = score + Number.parseInt(tracaDetailElement.prodTracaDetail.SANCTION);
            });
            if (score < traca.TRACA_DETAILS.length) {
              return '3';
            } else {
              if (score == traca.TRACA_DETAILS.length) {
                return '1';
              }
            }
          } else {
            return '4';
          }
        }
      }
    }
  }

  // Show dialog with process time and cycle
  processClickAction(subOperation: any) {
    console.log(subOperation);
    const time: number = subOperation.prodSubOperation.CUMUL_TEMPS;
    let cycle: number
    if (subOperation.prodSubOperation.DATE_FIN) {
      cycle = subOperation.prodSubOperation.DATE_FIN - subOperation.prodSubOperation.DATE_DEBUT;
    } else {
      cycle = 0
    }
    console.log(time/1000/60,'minutes', cycle);
  }
}
