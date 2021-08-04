import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-leader',
  templateUrl: './team-leader.component.html',
  styleUrls: ['./team-leader.component.css']
})
export class TeamLeaderComponent implements OnInit {

  sideBarOpen = true;
  selectedItem: any;
  constructor() { }

  ngOnInit(): void {
  }
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  showComponent(item: any) {
    this.selectedItem = item;
  }

}
