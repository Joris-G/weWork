import { Component, OnInit, OnChanges, Input, AfterViewChecked } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { TimerService } from '@app/service/timer.service';
import { StateService } from '@app/service/state.service';

@Component({
  selector: 'app-chrono',
  templateUrl: './chrono.component.html',
  styleUrls: ['./chrono.component.css']
})
export class ChronoComponent implements OnInit, AfterViewChecked {



  /**
   *end chrono time in minutes. The progressbar turn green when the end goal is over
   *
   * @type {number} in minutes
   * @memberof ChronoComponent
   */
  @Input() endTime: number;
  @Input() startValue: number;
  // achievedGoal: Observable<boolean>;

  color: ThemePalette = 'warn';
  mode: ProgressBarMode = 'determinate';
  bufferValue = 50;


  state: StateService = new StateService();
  timer: TimerService = new TimerService();

  constructor() { }

  ngOnInit(): void {
    this.state.setPlay();
    this.timer.setStartValue(this.startValue);
  }

  ngAfterViewChecked(): void {
    if (this.timer.minutes >= this.endTime) { this.color = "primary"; }
  }




  chronoButtonClick() {
    console.log(this.state.play);
    if (!this.state.play) {
      this.state.setStop();
      this.timer.start();
    } else {
      this.timer.stop();
      this.state.setPlay();
      console.log(this.timer.getStringTime());
    }
  }

  resetButtonClick() {
    this.state.setPlay();
    this.timer.reset();
  }

}
