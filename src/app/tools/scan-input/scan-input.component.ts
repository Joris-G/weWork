import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Error } from '@app/_interfaces/error';
import { ProdProcessServiceService } from 'src/app/service/prod-process-service.service';

@Component({
  selector: 'app-scan-input',
  templateUrl: './scan-input.component.html',
  styleUrls: ['./scan-input.component.css']
})
export class ScanInputComponent implements OnInit {
  @Output() scanInput = new EventEmitter<any>();
  focusTool: any;
  @ViewChild('inputOf') inputOf: ElementRef;
  error: Error = {
    state: false,
    msg: ''
  };
  techData:any = null;
  processInput: any = null;
  scanInputValue = [this.techData, this.processInput];

  constructor(private prodProcessService: ProdProcessServiceService) { }

  ngOnInit(): void { }
  ngAfterViewInit() {
    this.focusTool = setInterval(() => {
      this.inputOf.nativeElement.focus();
    }, 300);
  }

  sendScanInput(inputText: any) {
    if (inputText.value.includes('PROC')) {
      this.processInput = inputText.value;
      document.querySelector('.doc').classList.add('green');
      if (this.techData && this.processInput) {
        setTimeout(() => {
          this.scanInputValue = [this.techData, this.processInput];
          this.scanInput.emit(this.scanInputValue);
        }, 1000);
      }
    }
    else {
      this.techData = inputText.value;
      document.querySelector('.of').classList.add('green');
      if (this.techData && this.processInput) {
        setTimeout(() => {
          this.scanInputValue = [this.techData, this.processInput];
          this.scanInput.emit(this.scanInputValue);
        }, 1000);
      }
    }
    this.inputOf.nativeElement.value = '';
  }
}
