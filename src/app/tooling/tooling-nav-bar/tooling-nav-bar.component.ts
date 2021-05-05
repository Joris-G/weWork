import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tooling-nav-bar',
  templateUrl: './tooling-nav-bar.component.html',
  styleUrls: ['./tooling-nav-bar.component.css']
})
export class ToolingNavBarComponent implements OnInit {
  @Input() opened: boolean;
  selectedId: number;
  @Output() selectedComponent = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  showComponent(event) {
    this.selectedId = event;
    this.selectedComponent.emit(event);
  }
}
