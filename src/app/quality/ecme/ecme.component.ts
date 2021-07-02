import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ControlToolService } from '@app/service/control-tool.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-ecme',
  templateUrl: './ecme.component.html',
  styleUrls: ['./ecme.component.css']
})
export class EcmeComponent implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
    this.controlToolService.getControlToolList().subscribe(res=>{
      this.toolList = res;
      this.dataSource = new MatTableDataSource(this.toolList);
      this.dataSource.sort = this.sort;
      //console.log(res);
    });
  }
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['ID_ECME', 'TYPE_ECME', 'NUMERO_ECME', 'DATE_VALIDITE','action'];
  toolList:any;
  dataSource:MatTableDataSource<any>;
  edit:boolean = false;
  currentEcme:any;
  constructor(private controlToolService : ControlToolService) { }

  ngOnInit(): void {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editElement(element){
    this.edit = true;
    this.currentEcme = element;
//console.log(element);
  }
}
