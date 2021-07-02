import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProdProcessServiceService } from '@app/service/prod-process-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-print-fac',
  templateUrl: './print-fac.component.html',
  styleUrls: ['./print-fac.component.css']
})
export class PrintFacComponent implements OnInit {
  printOfForm: FormGroup;
  procNumber: any;
  ofNumber: any;
  processData: any;
  scanEnable: boolean;



  constructor(public formBuilder: FormBuilder, public prodProcessService : ProdProcessServiceService,private router: Router) { }

  ngOnInit(): void {

    this.printOfForm = this.formBuilder.group({
      ofNumber: ['', [Validators.required, Validators.minLength(8)]],
      procNumber:['',Validators.required],
    });
  }
  ofNumberChange(event){
    console.log(event.target.value);
    this.ofNumber = event.target.value;
  }


  procNumberChange(event){
    console.log(event.target.value);
    this.procNumber = event.target.value;
  }

  generateFacClick(){
    console.log('Generate fac action (param :' , this.ofNumber , this.procNumber);
    this.prodProcessService.getAllTraca(this.procNumber,this.ofNumber)
    .then(()=>{
      this.processData = this.prodProcessService.process;
      this.printFacTemplate();
    })

  }

  deleteDataClick(){
    this.prodProcessService.deleteAllTraca(this.procNumber,this.ofNumber).then(res=>{
      console.log(res);
    })
  }

  printFacTemplate() {
    console.log('try print FAC');
    this.router.navigate(['/app-fac-template'], { state: { data: this.processData } });
  }

  get getControl(){
    return this.printOfForm.controls;
  }
  scanSuccessHandler(event){
console.log(event.text);
this.scanEnable = false;
  }
}


