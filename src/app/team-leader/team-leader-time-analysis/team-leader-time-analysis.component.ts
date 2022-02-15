import { Component, OnInit, ChangeDetectionStrategy, AfterContentChecked, AfterViewInit, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProdProcessServiceService } from '@app/service/prod-process-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-team-leader-time-analysis',
  templateUrl: './team-leader-time-analysis.component.html',
  styleUrls: ['./team-leader-time-analysis.component.css'],
})
export class TeamLeaderTimeAnalysisComponent implements OnInit, AfterViewInit, OnChanges {
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log(changes);
  }


  ngAfterViewInit(): void {

  }

  form: FormGroup;
  ofInput: FormControl = new FormControl();
  prodProcess : any;
  listOfProdProcess:any[]= [];


  constructor(
    private formBuilder: FormBuilder,
    private processService: ProdProcessServiceService
  ) { }


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      ofInput: this.ofInput,
    });
  }


  analyseClick() {
    this.processService.getAllTraca('K100R820200800001-PROC01', this.ofInput.value).then(res => {
      // this.prodProcess = res;
      this.listOfProdProcess.push(res);
      this.listOfProdProcess = [].concat(this.listOfProdProcess);
      console.log(this.listOfProdProcess);
    });
  }


  addProcessClick(){
    console.log('addProcessClick');
    this.processService.getAllTraca('K100R820200800001-PROC01', this.ofInput.value).then(res => {
      this.listOfProdProcess.push(res);
      this.listOfProdProcess = [].concat(this.listOfProdProcess);
      console.log(this.listOfProdProcess);
    });
  }



}
