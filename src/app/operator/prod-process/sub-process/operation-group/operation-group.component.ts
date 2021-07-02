import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { TracaService } from '@app/service/traca.service';
import { ProdProcessServiceService } from '@app/service/prod-process-service.service';

@Component({
  selector: 'app-operation-group',
  templateUrl: './operation-group.component.html',
  styleUrls: ['./operation-group.component.css']
})
export class OperationGroupComponent implements OnInit, OnDestroy, OnChanges {
  @Input() opeGroup: any;
  @Output() currentSubOperation: any = new EventEmitter<any>();
  @Input() currentSubOpe: any;
  @Input() prodOperation: any;
  prodSubOperations: any;
  cmdOpt: string = 'expand_less';

  constructor(
    private prodProcessService: ProdProcessServiceService) { }

  ngOnChanges(changes: SimpleChanges): void {
    (this.prodOperation) ? this.prodSubOperations = this.prodOperation.subOperations : this.prodSubOperations = false;
  }

  ngOnDestroy(): void {
    this.prodProcessService.stopOperationTimer(this.prodOperation);
  }

  ngOnInit(): void {
  }

  toggleGroupVisibility() {
    (this.cmdOpt == 'expand_less') ? this.cmdOpt = 'expand_more' : this.cmdOpt = 'expand_less';
    // const subOperations = eventTarget.parentElement.parentElement.querySelectorAll(`.subOperation`);
    // subOperations.forEach(subope => {
    //   subope.classList.toggle('hide');
    // });
  }

  subOperationclickEvent(subOperation: any, event: any) {
    this.currentSubOpe = subOperation;
    this.emitClickedSubOperation(subOperation);
    this.toggleSubOperationState(event.target);
    if (!this.prodSubOperations) {
      this.currentSubOperation.subscribe(res => {
      })
      // this.tracaService.launchOperation(this.prodOperation,).subscribe((response: any) => {
      // });
    }
    // this.tracaService.initOperationTimer();
  }

  emitClickedSubOperation(subOperation: any) {
    (subOperation == this.currentSubOperation) ? '' : this.currentSubOperation.emit(subOperation);

  }

  toggleSubOperationState(eventTarget: HTMLElement) {
    const isAnyActiveSubOperation = document.getElementsByClassName('active-subOp');
    if (isAnyActiveSubOperation) {
      for (let index = 0; index < isAnyActiveSubOperation.length; index++) {
        isAnyActiveSubOperation[index].classList.remove('active-subOp');
      }
    }
    eventTarget.classList.toggle('active-subOp')
  }

}
