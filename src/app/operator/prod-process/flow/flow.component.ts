import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.css']
})
export class FlowComponent implements OnInit {

  @Input() process: any;
  @Output() currentOperation: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  clickOpActions(operation: any, event: any) {
    this.emitClickedOperation(operation);
    this.toggleOperationState(event.target);
  }

  emitClickedOperation(operation: any) {
    this.currentOperation.emit(operation);
  }

  toggleOperationState(eventTarget: HTMLElement) {
    const isAnyActiveOperation = document.getElementsByClassName('active-op');
    if (isAnyActiveOperation) {
      for (let index = 0; index < isAnyActiveOperation.length; index++) {
        isAnyActiveOperation[index].classList.remove('active-op');

      }
    }
    eventTarget.classList.toggle('active-op')
  }
}
