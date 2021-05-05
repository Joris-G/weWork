import { Injectable } from '@angular/core';
import { Observable, Observer, Subscriber } from 'rxjs';
import { Alert } from '@app/_interfaces/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  observer: Observer<Alert>;
  observable = new Observable<Alert>((observer: Subscriber<Alert>) => {
    this.observer = observer;
  });

  constructor() {
  }

  displayAlert(alertBody: string, alertType: string) {
    this.observer.next({ body: alertBody, type: alertType, show: true });
  }
}