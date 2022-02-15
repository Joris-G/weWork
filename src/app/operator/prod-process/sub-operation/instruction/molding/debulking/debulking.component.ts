import { Component, OnInit, Input } from '@angular/core';
import { Debulk } from '@app/_models/debulk';

@Component({
  selector: 'app-debulking',
  templateUrl: './debulking.component.html',
  styleUrls: ['./debulking.component.css']
})
export class DebulkingComponent implements OnInit {
  @Input() debulkingElement:Debulk;
  constructor() { }

  ngOnInit(): void {
    console.log(this.debulkingElement);
  }

}
