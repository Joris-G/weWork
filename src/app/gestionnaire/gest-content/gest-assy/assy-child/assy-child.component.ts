import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SupplyService } from '@app/service/supply.service';
import { SnackMessageComponent } from '@app/tools/snack-message/snack-message.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assy-child',
  templateUrl: './assy-child.component.html',
  styleUrls: ['./assy-child.component.css']
})
export class AssyChildComponent implements OnInit {
  @Input() child: any;
  @Input() form: FormGroup;
  durationInSeconds = 5;
  constructor(private supplyService: SupplyService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  workorderChange(event){
    this.supplyService.workorderIsLaunch(event.target.value).subscribe(res => {
      if (res) {
        event.target.style.color = 'red';
        this.openSnackBar(`Cet OF semble déjà lancé dans l'application`)
      }else{
        event.target.style.color = '';
        this.child.value.workorder=event.target.value;
    console.log(event.target.value);
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
