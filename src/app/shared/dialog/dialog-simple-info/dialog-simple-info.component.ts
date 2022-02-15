import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalData } from '@app/_models/modal-data';

@Component({
  selector: 'app-dialog-simple-info',
  templateUrl: './dialog-simple-info.component.html',
  styleUrls: ['./dialog-simple-info.component.css']
})
export class DialogSimpleInfoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogSimpleInfoComponent> ,
     @Inject(MAT_DIALOG_DATA) public data: ModalData) { }

  ngOnInit(): void {
    console.log(this.data);
  }

}


