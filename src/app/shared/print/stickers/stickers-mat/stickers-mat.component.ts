import { Component, OnInit, Input } from '@angular/core';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stickers-mat',
  templateUrl: './stickers-mat.component.html',
  styleUrls: ['./stickers-mat.component.css']
})
export class StickersMATComponent implements OnInit {

  elementType: NgxQrcodeElementTypes = NgxQrcodeElementTypes.CANVAS;
  correctLevel: NgxQrcodeErrorCorrectionLevels = NgxQrcodeErrorCorrectionLevels.LOW;

  @Input() stickersDatas: any[] = [];
  stickersNewDatas: any;
  constructor(private router: Router) {
    // this.router.getCurrentNavigation().extras.state.data.shift();
    const data = this.router.getCurrentNavigation().extras.state.data;
    console.log(data);
    this.stickersNewDatas = [];
        data.datas.forEach((part, index) => {
          console.log(part,index);
            const txtQrCode = `MAT ${part.ID_MATERIALS},${part.ID_MAT}`;
            this.stickersNewDatas.push({
              articleSap: part.ID_MATERIALS,
              batch: part.NUMERO_DE_LOT,
              designation: data.designation,
              per:part.DATE_DE_PEREMPTION,
              txt: txtQrCode
            });
        });
        console.log(this.stickersNewDatas);
  }

  ngOnInit(): void {

  }

}
