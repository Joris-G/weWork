import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-team-leader-content',
  templateUrl: './team-leader-content.component.html',
  styleUrls: ['./team-leader-content.component.css']
})
export class TeamLeaderContentComponent implements OnInit {

  @Input() selectedItem: any;
  constructor() { }

  ngOnInit(): void {
  }

}
