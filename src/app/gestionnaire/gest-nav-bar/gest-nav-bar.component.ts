import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-gest-nav-bar',
  templateUrl: './gest-nav-bar.component.html',
  styleUrls: ['./gest-nav-bar.component.css']
})
export class GestNavBarComponent implements OnInit {
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
