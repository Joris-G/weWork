import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-gest-content',
  templateUrl: './gest-content.component.html',
  styleUrls: ['./gest-content.component.css']
})
export class GestContentComponent implements OnInit {
  @Input() selectedItem: any;
  @Output() toggleNavEmitter: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }
  toggleNav() {
    this.toggleNavEmitter.emit();
  }
}
