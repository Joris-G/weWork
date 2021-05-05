import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProdProcessServiceService } from '@app/service/prod-process-service.service';
import { Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'app-sub-ope-group',
  templateUrl: './sub-ope-group.component.html',
  styleUrls: ['./sub-ope-group.component.css']
})
export class SubOpeGroupComponent implements OnInit,OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.active = this.isActive(this.subOperation);
  }
  isTraca: boolean=false;
  tracaStatus: string;
  @Input() subOperation: any;
  @Input() currentSubOpe:any
  subOpeProdStatus: any;
  subOpeTracaStatus: any;
  active: boolean;
  constructor(private prodProcessServiceService: ProdProcessServiceService) { }

  isActive(subOpeToTest: any): boolean {
    if (this.currentSubOpe.ID_SUB_OPERATION == subOpeToTest.ID_SUB_OPERATION) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit(): void {
    this.active = this.isActive(this.subOperation);
    (this.subOperation.prodSubOperation.DATE_FIN) ? this.subOpeProdStatus = '1' : this.subOpeProdStatus = '4';
    this.isTraca = this.isAnyTraca();
    if (this.isTraca) {
      this.tracaStatus = this.getTracaStatus();
    }
  }

  isAnyTraca(): boolean {
    let response :boolean;
    if(!this.subOperation.STEPS) return false;
    for (const step of this.subOperation.STEPS) {
      if (step.TRACA) {
        response = true;
      } else {
        response = false;
      }
    }
    return response;
  }

  getTracaStatus(): string {
    for (const step of this.subOperation.STEPS) {
      if (step.TRACA) {
        if (step.TRACA.prodTraca) {
          let score: number = 0;
          step.TRACA.TRACA_DETAILS.forEach(tracaDetailElement => {
            score = score + Number.parseInt(tracaDetailElement.prodTracaDetail.SANCTION);
          });
          if (score < step.TRACA.TRACA_DETAILS.length) {
            return '3';
          } else {
            if (score == step.TRACA.TRACA_DETAILS.length) {
              return '1';
            }
          }
        }else{
          return '4';
        }
      }
    }
  }
}
