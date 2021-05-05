import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-stickers',
  templateUrl: './stickers.component.html',
  styleUrls: ['./stickers.component.css']
})
export class StickersComponent implements OnInit {

  elementType: NgxQrcodeElementTypes = NgxQrcodeElementTypes.CANVAS;
  correctLevel: NgxQrcodeErrorCorrectionLevels = NgxQrcodeErrorCorrectionLevels.LOW;

  @Input() stickersDatas: any[] = [];
  stickersNewDatas: any;
  constructor(private router: Router) {
    // this.router.getCurrentNavigation().extras.state.data.shift();
    const data = this.router.getCurrentNavigation().extras.state.data;

    data.forEach((part, index) => {
      data[index]['datas'] = [];
      for (let repeat = 0; repeat < part[2]; repeat++) {
        const txtQrCode = `OF ${part[0]},${part[1]},0`;
        data[index]['datas'].push({
          articleSap: part[0],
          workOrder: part[1],
          ebauche: part[3],
          txt: txtQrCode
        });
      }
    });
    this.stickersNewDatas = data;
  }

  ngOnInit(): void {
    this.stickersNewDatas.forEach(data => {
      data.datas.forEach(element => {
        //console.log(element);
      });
    });
  }

}
