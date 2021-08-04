import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-simple-info',
  templateUrl: './dialog-simple-info.component.html',
  styleUrls: ['./dialog-simple-info.component.css']
})
export class DialogSimpleInfoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {title: any, message : string}) { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
