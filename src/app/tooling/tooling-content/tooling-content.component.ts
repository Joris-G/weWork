import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tooling-content',
  templateUrl: './tooling-content.component.html',
  styleUrls: ['./tooling-content.component.css']
})
export class ToolingContentComponent implements OnInit {
  @Input() selectedItem: any;
  constructor() { }

  ngOnInit(): void {
  }

}
