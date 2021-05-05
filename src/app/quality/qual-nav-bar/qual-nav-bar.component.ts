import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-qual-nav-bar',
  templateUrl: './qual-nav-bar.component.html',
  styleUrls: ['./qual-nav-bar.component.css']
})
export class QualNavBarComponent implements OnInit {
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
