import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {

@Input()currentStep:any;
@Input()tracaDetails:any;

formTime:FormGroup;
timeInput:FormControl = new FormControl('timeInput');
endTime:number = 20;

/**
 *
 *
 * @type {number} in secondes
 * @memberof TimeComponent
 */
startValue:number = 0;

  constructor(private fb : FormBuilder) { }

  ngOnInit(): void {
    this.formTime = this.fb.group({
      'timeInput':this.timeInput
    });


    // this.endTime = 20;
    if(!!this.tracaDetails.prodTracaDetail?.DATE_DEBUT){
      const startDate = new Date(this.tracaDetails.prodTracaDetail.DATE_DEBUT).getTime();
      const timeFromStart = Date.now() - startDate;
      this.startValue = timeFromStart * 1000;
    }else{
      this.startValue = 0;
    }
  }

}
