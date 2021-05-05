import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gest-content',
  templateUrl: './gest-content.component.html',
  styleUrls: ['./gest-content.component.css']
})
export class GestContentComponent implements OnInit {
  @Input() selectedItem: any;
  constructor() { }

  ngOnInit(): void {
  }

}
