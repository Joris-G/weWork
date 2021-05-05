import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TracaService } from '@app/service/traca.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sub-process',
  templateUrl: './sub-process.component.html',
  styleUrls: ['./sub-process.component.css']
})
export class SubProcessComponent implements OnInit, OnChanges {
  @Output() currentSubOperationEmitter: any = new EventEmitter<any>();

  @Input() currentSubOperation: any;
  @Input() prodProcess: any;
  @Input()process:any;
  @Output() prodProcessUpdate: any = new EventEmitter<any>();
  anyTraca: boolean;
  constructor(private tracaService: TracaService) { }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("subprocess change", changes);
    // if (changes.prodProcess) {
    //   // console.log("prodProcess Changes", changes.prodProcess.currentValue);
    //   this.prodProcessUpdate.emit(changes.prodProcess.currentValue);
    // }
  }

  ngOnInit(): void {
    console.log('init');
  }

  showOp(item: any) {
    this.currentSubOperationEmitter.emit(item);
  }


}
