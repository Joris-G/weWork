import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-prep-content',
  templateUrl: './prep-content.component.html',
  styleUrls: ['./prep-content.component.css']
})
export class PrepContentComponent implements OnInit {
@Input() selectedItem:any;
  constructor() { }

  ngOnInit(): void {
  }

}
