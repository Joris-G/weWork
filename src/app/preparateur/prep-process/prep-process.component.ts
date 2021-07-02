import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prep-process',
  templateUrl: './prep-process.component.html',
  styleUrls: ['./prep-process.component.css']
})
export class PrepProcessComponent implements OnInit {
  processSelect:boolean = false;
  process:any;
  constructor() { }

  ngOnInit(): void {
  }
  showProcess(event){
    this.processSelect = true;
    //console.log(event);
    this.process = event;
  }


}
