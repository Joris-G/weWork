import { Component, OnInit, OnChanges } from '@angular/core';
import { PartService } from '@app/service/part.service';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  AbstractControl
} from '@angular/forms';
import { SupplyService } from '@app/service/supply.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackMessageComponent } from '@app/tools/snack-message/snack-message.component';

@Component({
  selector: 'app-gest-assy',
  templateUrl: './gest-assy.component.html',
  styleUrls: ['./gest-assy.component.css']
})
export class GestAssyComponent implements OnInit {
  listRefOrdo = [
    { value: 7259753, viewValue: 'ELEVATOR LH' },
    { value: 7259754, viewValue: 'ELEVATOR RH' }
  ];
  selectedValue: any;
  allChildren: any;
  form1: FormGroup;
  form2: FormGroup;
  children: FormControl[] = [];
  parent: AbstractControl[] = [];
  ordoWorkorder: any;
  partName: any;
  durationInSeconds = 5;

  constructor(
    private partService: PartService,
    private formBuilder: FormBuilder,
    private supplyService: SupplyService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form1 = this.formBuilder.group({
      ordoWorkorder: '',
      partName: ''
    });
    //console.log(this.form1);
    //console.log(this.form1.controls['partName']);
    Object.keys(this.form1.controls).forEach((key, index) => {
      //console.log(this.form1.controls[key]);
      this.parent.push(this.form1.controls[key]);
      //  this.children.push(this.form1.controls['partName']);
    });
    // //console.log(this.form1.controls);
  }

  refOrdoChange(selectedValue: number) {
    this.updateOrdoChildren(selectedValue);
  }

  updateOrdoChildren(selectedValue: number): any {
    this.children = [];
    this.form1.setValue({
      partName:"",
      ordoWorkorder:""
    });
    this.partService.getAllPartChildren(selectedValue).subscribe(res => {
      this.allChildren = res;
      const group: any = {};
      this.allChildren.forEach((child, index) => {
        group[index] = new FormControl({
          key: index,
          workorder: '',
          obj: child
        });
        this.children.push(group[index]);
      });

      this.form2 = new FormGroup(group);
      //console.log(res, this.form2);
    });
  }
  saveAssembly() {
    // //console.log(this.children, this.parent);
    this.supplyService
      .launchWorkorder(
        this.selectedValue,
        this.form1.controls['ordoWorkorder'].value,
        this.form1.controls['partName'].value
      )
      .subscribe(res => {
        console.log(res);
        if (res) {
          this.children.forEach(child => {
            //console.log(
              //child.value.obj.Article,
              //child.value.workorder,
              //this.form1.controls['partName'].value
            //);
            this.supplyService
              .launchWorkorder(
                child.value.obj.Article,
                child.value.workorder,
                this.form1.controls['partName'].value
              )
              .subscribe(res => {
                console.log(res);
                if(res){

                }
              });
          });
        }
      });
    //console.log(this.parent);
  }

  workorderOnChange(event: any) {
    //console.log(event);
    this.supplyService.workorderIsLaunch(event.target.value).subscribe(res => {
      if (res) {
        event.target.style.color = 'red';
        this.openSnackBar(`Cet OF semble déjà lancé dans l'application`)
      }else{
        event.target.style.color = '';
      }
    });
  }

  openSnackBar(message:string) {
    this._snackBar.openFromComponent(SnackMessageComponent, {
      data:message,
      duration: this.durationInSeconds * 1000,
    });
  }
}
