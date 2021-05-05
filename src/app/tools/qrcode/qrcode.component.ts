import { Component, Input, OnInit } from '@angular/core';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent implements OnInit {
  @Input() subOperation;
  elementType: NgxQrcodeElementTypes = NgxQrcodeElementTypes.IMG;
  @Input() command: string = '1';
  correctLevel: NgxQrcodeErrorCorrectionLevels = NgxQrcodeErrorCorrectionLevels.LOW;
  constructor() { }

  ngOnInit(): void {
  }


}
