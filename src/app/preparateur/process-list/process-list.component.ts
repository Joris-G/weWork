import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ProdProcessServiceService } from '@app/service/prod-process-service.service';
import { PartService } from '@app/service/part.service';
import { MatTableDataSource } from '@angular/material/table';
import { ProcessService } from '@app/service/process.service';

@Component({
  selector: 'app-process-list',
  templateUrl: './process-list.component.html',
  styleUrls: ['./process-list.component.css']
})
export class ProcessListComponent implements OnInit {
  displayProcess: boolean = false;
  displayProcessList: boolean = false;
  allProcess: any;
  @Output() selectedProcess= new EventEmitter();

  displayedColumns: string[] = ['idProcess', 'version', 'creationDate', 'creator', 'startService'];
  dataSource: MatTableDataSource<any>;

  @ViewChild('articleSapInput') inputArticle: ElementRef<HTMLInputElement>;

  constructor(private prodProcessService: ProdProcessServiceService,private processService :ProcessService, private partService: PartService) { }

  ngOnInit(): void {
    this.processService.getAllProcessesList().subscribe(res=>{
      this.displayProcessList=true;
      console.log(res);
      this.dataSource = new MatTableDataSource<any>(res);
    })
  }
  showProcess(idProcess: string) {
    this.displayProcess = !this.displayProcess;
    this.displayProcessList = false;
    this.selectedProcess.emit(this.allProcess.find(process => process.ID_PROCESS == idProcess));
  }
  rowProcessClickAction(row: any) {
    //console.log(row);
    this.showProcess(row.idProcess);
  }



  getAllProcesses() {
    const article = this.inputArticle.nativeElement.value;
    this.prodProcessService.getAllProcesses(article).subscribe((res: any) => {
      this.displayProcessList = true;
      this.allProcess = res
      //console.log(res);
      const data = []
      res.forEach(process => {
        data.push({ idProcess: process.ID_PROCESS, version: process.INDICE_PROCESS, creationDate: process.DATE_DE_CREATION, creator: process.UTILISATEUR_CREATION, startService: '07/04/2021' });
      });

      this.dataSource = new MatTableDataSource<any>(data);
      //console.log(this.dataSource);

    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
