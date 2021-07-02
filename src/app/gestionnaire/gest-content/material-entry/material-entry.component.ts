import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MaterialService } from '@app/service/material.service';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-material-entry',
  templateUrl: './material-entry.component.html',
  styleUrls: ['./material-entry.component.css']
})
export class MaterialEntryComponent implements OnInit {
  selectedValue: any;
  listMatieres: any;
  materialForm: FormGroup;
  newProdMaterialList: Object;
  constructor(private formBuilder: FormBuilder, private materialService: MaterialService, private router: Router, private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('fr');
  }

  ngOnInit(): void {

    this.materialForm = this.formBuilder.group({
      matiere: '',
      batchNumber: '',
      shelflife: '',
      numberOfProducts: 0
    });

    this.materialService.getMaterialList().subscribe(res => {
      this.listMatieres = res
    });

  }
  matiereChange(selectedValue: number) {
    console.log(selectedValue);
    // this.updateOrdoChildren(selectedValue);
  }
  dateEvent(event: MatDatepickerInputEvent<Date>) {
    console.log(this.checkDate(event.value));
    console.log(event.value);
  }
  checkDate(value: Date): Boolean {
    return value >= new Date();
  }
  printOnClick() {
    console.log(this.materialForm);
    this.materialService.recordMaterials(this.materialForm.value).subscribe(res => {
      console.log(res);
      this.newProdMaterialList = {
        datas:res,
        designation : this.listMatieres.find(mat=> mat.ID_MATIERE == this.materialForm.value.matiere).DESIGNATION_SIMPLIFIEE
      }
      this.printLabels(this.newProdMaterialList);
    });
  }

  printLabels(prodMaterialList: any): any {
    this.router.navigate(['./app-stickers-mat'], {
      state: {data : prodMaterialList}
    });
  }


}
