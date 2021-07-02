import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-control-tool',
  templateUrl: './dialog-control-tool.component.html',
  styleUrls: ['./dialog-control-tool.component.css']
})
export class DialogControlToolComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {type:string, scannedTool: any, message : string}) { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
