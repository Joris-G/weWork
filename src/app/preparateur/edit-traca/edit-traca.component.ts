import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-traca',
  templateUrl: './edit-traca.component.html',
  styleUrls: ['./edit-traca.component.css']
})
export class EditTracaComponent implements OnInit {
  @Input() tracaList: any;
  @Input() subOperation: any;
  selectedType: number;
  newTraca: FormGroup;
  tracaType: FormControl = new FormControl();
  tracaTypeList: any[] = [
    { value: 1, viewValue: 'Matière' },
    { value: 2, viewValue: 'Epaisseur' },
    { value: 3, viewValue: 'Calage' },
    { value: 4, viewValue: 'Auto-controle' },
    { value: 5, viewValue: 'Polymérisation' },
  ];
  tracaForm: FormGroup;

  // @Output() selectionChange: EventEmitter<any>
  constructor() { }

  ngOnInit(): void {
    this.newTraca = new FormGroup({
      tracaType: this.tracaType
    })
  }
  tracaTypeSelect(event: any) {
    //console.log(event);
  }
  saveNewTraca() {
    //console.log(this.tracaType);
  }
}
