import { Component, OnInit, Input } from '@angular/core';
import { Layup } from '@app/_models/layup';

@Component({
  selector: 'app-layup',
  templateUrl: './layup.component.html',
  styleUrls: ['./layup.component.css']
})
export class LayupComponent implements OnInit {

  @Input() layupElement:Layup;

  constructor() { }

  ngOnInit(): void {
  }


}
