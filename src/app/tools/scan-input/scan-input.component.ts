import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Error } from '@app/_interfaces/error';
import { ProdProcessServiceService } from 'src/app/service/prod-process-service.service';
import { SupplyService } from '@app/service/supply.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogSimpleInfoComponent } from '@app/shared/dialog/dialog-simple-info/dialog-simple-info.component';
import { ProcessService } from '@app/service/process.service';

@Component({
  selector: 'app-scan-input',
  templateUrl: './scan-input.component.html',
  styleUrls: ['./scan-input.component.css']
})
export class ScanInputComponent implements OnInit,OnDestroy {
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
    public dialog: MatDialog,
    private processService: ProcessService) { }

  ngOnInit(): void {
    console.log('init scan-input');
  }
  ngAfterViewInit() {
    this.focusTool = setInterval(() => {
      this.inputOf.nativeElement.focus();
      console.log('focus on Scaninput');
    }, 300);
  }

  sendScanInput(inputText: string) {
    if (this.isProcess(inputText)) {
      this.processService.getProcessInfo(inputText).subscribe((res: any) => {
        console.log(res);
        if (res) {
          document.querySelector('.doc').classList.add('green');
          this.processInput = res;
          this.testIfComplete();
        } else {
          console.log(`Ce n'est pas un process connu. Contactez le préparateur. ${inputText}`);
          const dialogRef = this.dialog.open(DialogSimpleInfoComponent, {
            data: {
              title: 'Alerte',
              message: `Ce n'est pas un process connu. Contactez le préparateur. ${inputText}`,
              type: 'alert'
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            console.log(data);
            return;
          })
        }

      });
    }
    else if (this.isWorkorder(inputText)) {
      // else if (parseInt(inputText) && inputText.length == 8) {
      this.techData = inputText;
      this.getOfInfo(parseInt(inputText))
        .then(result => {
          this.scannedOfInfo = {
            article: result.workorderInfo.NOM_ARTICLE,
            workorder: result.workorderInfo.WORKORDER,
            designation: result.articleInfo.Designation,
            partName: result.workorderInfo.PRENOM_PIECE,
          }
          document.querySelector('.of').classList.add('green');
          this.testIfComplete();
        })
        .catch(error => {
          console.error(error);
          const dialogRef = this.dialog.open(DialogSimpleInfoComponent, {
            data: {
              title: 'Alerte OF',
              message: `${this.techData} ne semble pas être un OF connu`,
              type:'alert'
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            console.log(data);
          })
        });


    }
    else {
      console.log(`l'input n'est pas reconnu ni comme un OF ni comme un process`);
      const dialogRef = this.dialog.open(DialogSimpleInfoComponent, {
        data: {
          title: 'Alerte',
          message: `l'input :   ${inputText}  n'est pas reconnu ni comme un OF ni comme un process`,
          type: 'alert'
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        console.log(data);
        return;
      })
    }

    this.inputOf.nativeElement.value = '';
  }
  testIfComplete(): any {
    if (this.techData && this.processInput && this.isCorrectData()) {
      this.scanInputValue = [this.techData, this.processInput.CODIF_PROCESS];
      this.scanInput.emit(this.scanInputValue);
    }
  }

  isProcess(inputText: string): boolean {
    return (inputText.includes('PROC') && inputText.split("-")[1].length == 6)
  }


  isCorrectData(): boolean {
    if (this.scannedOfInfo.article != this.processInput.ARTICLE_SAP) {
      console.log(`le couple OF / Process scanné n'est pas bon ou inactif. Veuillez contacter le préparateur`);
      const dialogRef = this.dialog.open(DialogSimpleInfoComponent, {
        data: {
          title: 'Alerte',
          message: `le couple OF / Process scanné n'est pas bon ou inactif. Veuillez contacter le préparateur`,
          type: 'alert'
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        console.log(data);
      });
      return false;
    } else {
      return true;
    }
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


  isWorkorder(inputText: string): any {
    return (parseInt(inputText) && inputText.length == 8)
  }

  @HostListener('unloaded')
  ngOnDestroy() {
    this.clearInterval();
    console.log('Items destroyed');
  }

  clearInterval(){
    clearInterval(this.focusTool);
  }
}



