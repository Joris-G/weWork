import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quality',
  templateUrl: './quality.component.html',
  styleUrls: ['./quality.component.css']
})
export class QualityComponent implements OnInit {
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
