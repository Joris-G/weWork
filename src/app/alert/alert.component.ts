import { animate, AnimationEvent, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Alert } from '@app/_interfaces/alert';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [
    trigger('showAlert', [
      transition(':enter', [
        style({ opacity: 0, right: '-350px' }),
        animate('300ms', style({ opacity: 1, right: '50px' })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0, right: '-350px' }))
      ])
    ]),
  ]
})
export class AlertComponent implements OnInit {

  @Input() event: Alert;
  @Output() eventToDelete = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.close(this.event);
    }, 4000);
  }

  close(event: Alert) {
    event.show = false;
  }

  animationDone(event: AnimationEvent) {
    if (event.toState) {
      this.eventToDelete.emit();
    }
  }
}