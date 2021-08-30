import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-demande-amelioration-outillage',
  templateUrl: './demande-amelioration-outillage.component.html',
  styleUrls: ['./demande-amelioration-outillage.component.css']
})
export class DemandeAmeliorationOutillageComponent implements OnInit {

@Input() requestDatas:any;
@Input() constFormDatas:any
  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

}
