import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PartService } from '@app/service/part.service';
import { ProdProcessServiceService } from '@app/service/prod-process-service.service';

@Component({
  selector: 'app-preparateur',
  templateUrl: './preparateur.component.html',
  styleUrls: ['./preparateur.component.css']
})
export class PreparateurComponent implements OnInit, OnChanges, AfterViewInit {
  sideBarOpen = true;

  selectedItem: any;


  constructor() { }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log('change');
    ////console.log(changes);
  }

  ngOnInit(): void {

  }
  showComponent(item: any) {
    this.selectedItem = item;
  }



  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

}
