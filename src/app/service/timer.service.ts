import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private _hours: number = 0;
  private _minutes: number = 0;
  private _secondes: number = 0;
  private _totalSecondes: number = 0;

  private _timer;

  get hours(): number { return this._hours; }
  get minutes(): number { return this._minutes; }
  get seconds(): number { return this._secondes; }
  get totalSecondes(): number { return this._totalSecondes; }

  constructor() { }
  start() {
    this._timer = setInterval(() => {
      this._hours = Math.floor(++this._totalSecondes / 3600);

      this._minutes = Math.floor((this._totalSecondes / 60) - (this._hours * 60));

      this._secondes = this._totalSecondes - this._hours * 3600 - this._minutes * 60;

      // console.log(this._totalSecondes);
    }, 1000);
  }

  stop() {
    clearInterval(this._timer);
  }

  reset() {
    this.stop();
    this._totalSecondes = this._hours = this._minutes = this._secondes = 0;
  }

  getStringTime(): string {
    return `${this._hours ? this._hours + 'heure' : ''}  ${this._minutes} minutes et ${this._secondes} secondes`;
  }


  /**
   *Define start value
   *
   * @param {number} secondesFromStart
   * @memberof TimerService
   */
  setStartValue(secondesFromStart:number){
    this._totalSecondes = secondesFromStart;
  }


}
