import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-material-shelflife-date',
  templateUrl: './dialog-material-shelflife-date.component.html',
  styleUrls: ['./dialog-material-shelflife-date.component.css']
})
export class DialogMaterialShelflifeDateComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {scannedMaterial: any}) {
  console.log(data);
  }

  ngOnInit(): void {
    console.log(this.data);
  }

}
