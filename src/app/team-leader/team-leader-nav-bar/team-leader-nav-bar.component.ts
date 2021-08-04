import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-team-leader-nav-bar',
  templateUrl: './team-leader-nav-bar.component.html',
  styleUrls: ['./team-leader-nav-bar.component.css']
})
export class TeamLeaderNavBarComponent implements OnInit {

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
