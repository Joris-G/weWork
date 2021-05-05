import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-qual-content',
  templateUrl: './qual-content.component.html',
  styleUrls: ['./qual-content.component.css']
})
export class QualContentComponent implements OnInit {
  @Input() selectedItem: any;
  constructor() { }

  ngOnInit(): void {
  }

}
