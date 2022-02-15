import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-trio',
  templateUrl: './status-trio.component.html',
  styleUrls: ['./status-trio.component.css']
})
export class StatusTrioComponent implements OnInit {
  @Input() status: string;
  @Input() text : string;
  constructor() { }

  ngOnInit(): void {
  }


  getStyle(status: string) {
    switch (status) {
      case '1':
        return 'rgb(102, 255, 153)';
      case '2':
        return 'rgb(255, 153, 51)';

      case '3':
        return 'rgb(255, 0, 102)';
      case '4':
        return 'rgba(0, 13, 36,0.5)';

      default:
        return 'rgba(0, 13, 36,0.5)';
    }

    // return this.style;
  }
}
