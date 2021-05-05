import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-prep-nav-bar',
  templateUrl: './prep-nav-bar.component.html',
  styleUrls: ['./prep-nav-bar.component.css']
})
export class PrepNavBarComponent implements OnInit {
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
