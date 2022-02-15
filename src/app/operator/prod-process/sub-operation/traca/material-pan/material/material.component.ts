import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {

  @Input()traca:any;

  isKit:boolean;

  constructor() { }

  ngOnInit(): void {
    this.isKit = testIfIsKit();
  }

}

function testIfIsKit(): boolean {
  return (this.traca.matInfo.ARTICLE_SAP.startWith('7'));
}

