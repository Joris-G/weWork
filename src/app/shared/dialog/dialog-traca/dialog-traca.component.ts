import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-traca',
  templateUrl: './dialog-traca.component.html',
  styleUrls: ['./dialog-traca.component.css']
})
export class DialogTracaComponent implements OnInit {
response:boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {traca: any}) {
    console.log(data);
    }

    ngOnInit(): void {
    }


}
