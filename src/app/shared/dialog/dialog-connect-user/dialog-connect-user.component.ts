import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dialog-connect-user',
  templateUrl: './dialog-connect-user.component.html',
  styleUrls: ['./dialog-connect-user.component.css']
})
export class DialogConnectUserComponent implements OnInit {
  @ViewChild('inputQrCode') inputQrCode: ElementRef;
  focusTool: any;
  constructor() { }

  ngOnInit(): void {
  }
  scanAction(input){
    console.log(input);
  }

  ngAfterViewInit() {
    this.focusOnInput();
  }

  focusOnInput(): any {
    console.log('focus auto Input');
    // this.listenIddle=null;
    this.focusTool = setInterval(() => {
      this.inputQrCode.nativeElement.focus();
    }, 300);
  }

  deleteFocusInput() {
    console.log('delete auto focus');
    clearInterval(this.focusTool);
  }

  ngOnDestroy() {
    this.deleteFocusInput();
  }
}
