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
import { SupplyService } from '@app/service/supply.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogSimpleInfoComponent } from '@app/shared/dialog/dialog-simple-info/dialog-simple-info.component';

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
  techData: any = null;
  processInput: any = null;
  scanInputValue = [this.techData, this.processInput];
  scannedOfInfo: any;

  constructor(
    private prodProcessService: ProdProcessServiceService,
    private supplyService: SupplyService,
    public dialog: MatDialog, ) { }

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
      this.getOfInfo(inputText.value)
        .then(result => {
          this.scannedOfInfo = {
            article: result.workorderInfo.NOM_ARTICLE,
            workorder: result.workorderInfo.WORKORDER,
            designation: result.articleInfo.Designation,
            partName: result.workorderInfo.PRENOM_PIECE,
          }
          document.querySelector('.of').classList.add('green');
          if (this.techData && this.processInput) {
            setTimeout(() => {
              this.scanInputValue = [this.techData, this.processInput];
              this.scanInput.emit(this.scanInputValue);
            }, 1000);
          }
        })
        .catch(error => {
          console.error(error);
          const dialogRef = this.dialog.open(DialogSimpleInfoComponent, {
            data: {
              title: 'Alerte OF',
              message: `${this.techData} ne semble pas être un OF connu`
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            console.log(data);
          })
        });


    }
    this.inputOf.nativeElement.value = '';
  }

  getOfInfo(scannedWorkorder: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.supplyService.getWorkorderInfo(scannedWorkorder).subscribe(result => {
        console.log(result);
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }
}
