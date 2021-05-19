import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-specification-besoin-outillage',
  templateUrl: './specification-besoin-outillage.component.html',
  styleUrls: ['./specification-besoin-outillage.component.css']
})
export class SpecificationBesoinOutillageComponent implements OnInit,OnChanges {
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log(changes);
  }
@Input() formDatas:any;
  constructor() { }

  ngOnInit(): void {
  }

}
