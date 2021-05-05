import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tooling',
  templateUrl: './tooling.component.html',
  styleUrls: ['./tooling.component.css']
})
export class ToolingComponent implements OnInit {
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
