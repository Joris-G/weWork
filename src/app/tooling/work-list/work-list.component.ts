import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ToolService } from '@app/service/tool.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { UserService } from '@app/service/user.service';
import { MatSort } from '@angular/material/sort';
import { DomSanitizer } from '@angular/platform-browser';

const FILTER_STATUS_VALUES = [
  { viewValue: 'à faire', value: 1 },
  { viewValue: 'non affecté', value: 0 },
  { viewValue: 'en cours de travaux', value: 2 },
  { viewValue: 'terminé', value: 3 }
];

export interface ToolRequest {
  id: number;
  dateDemande: string;
  demandeur: string;
  toolNumber: string;
  description: string;
  dateBesoin: string;
  statut: { value: number; viewValue: string };
  dateExecution: string;
  groupeAffectation: string;
  requestType:string;
}

@Component({
  selector: 'app-work-list',
  templateUrl: './work-list.component.html',
  styleUrls: ['./work-list.component.css']
})

export class WorkListComponent implements OnInit,AfterViewInit {

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  @ViewChild(MatSort) sort: MatSort;
  filterStatusItems = FILTER_STATUS_VALUES;
  showClosedRequests:boolean=false
  user: any = {
    role: 2
  };

  items: any = [
    {
      viewGroup: 'Fraisage',
      value: 3
    },
    {
      viewGroup: 'Tournage',
      value: 4
    }
  ];

  dataSource= new MatTableDataSource<any>();
  displayedColumns = [
    'id',
    'dateDemande',
    'demandeur',
    'requestType',
    'toolNumber',
    'description',
    'dateBesoin',
    'groupeAffectation',
    'statut',
    'dateExecution',
    'downloadPdf'
  ];

  textDescriptFilter = new FormControl('');
  statusFilter = new FormControl('');
  requestTypeFilter = new FormControl('');

  filterValues: any = {
    status: '',
    type: '',
    text:''
  }

  tools: any[];
  users: any[];
  activateModify: boolean = false;





  constructor(
    private toolService: ToolService,
    public formBuilder: FormBuilder,
    private userService: UserService,
    public sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    document.addEventListener('keydown', () => {
      if (this.user.role == 2) {
        this.activateModify = !this.activateModify;
      }
    });
    this.updateData();
    this.fieldListener();
  }
  updateData(): any {
    this.toolService.getToolsList().then((res: []) => {
      this.tools = res;
    });
    this.userService.getUsersListByRole().then((usersList: any[]) => {
      this.users = usersList;
    });
    this.toolService.getToolRequestList().then(
      (toolRequestList: any[]) => {
        //console.log(toolRequestList);
        const buildToolRequestList = [];
        toolRequestList.forEach(toolRequest => {
          buildToolRequestList.push({
            id: toolRequest.ID_TOOLING_REQUEST,
            dateDemande: toolRequest.DATE_DEMANDE,
            requestType: toolRequest.TYPE_DEMANDE,
            demandeur: this.users.find(
              user => user.ID_UTILISATEUR == toolRequest.ID_USER
            ).NOM,
            toolNumber: this.tools.find(
              tool => tool.ID_TOOL == toolRequest.ID_TOOL
            ).SAP_NUMBER,
            description: toolRequest.DESCRIPTION,
            dateBesoin: toolRequest.DATE_BESOIN,
            statut: this.filterStatusItems.find(
              status => status.value == toolRequest.STATUT
            ),
            dateExecution: toolRequest.DATE_REALISATION,
            groupeAffectation: toolRequest.GROUPE_AFFECTATION
          });
          //console.log(toolRequest);
        });
        this.dataSource.data =buildToolRequestList;
        this.dataSource.filterPredicate = this.getFilterPredicate();
        this.dataSource
      },
      () => {
        console.error('error tool request list');
      }
    );
  }

 getRequestType(requestType:number):string{
  return this.toolService.REQUEST_TYPES.find(type=>type.value == requestType).viewValue
 }


 private fieldListener() {
  this.statusFilter.valueChanges
    .subscribe(
      status => {
        this.filterValues.status = status;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    )
    this.textDescriptFilter.valueChanges
    .subscribe(
      text => {
        this.filterValues.text = text;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    )
  this.requestTypeFilter.valueChanges
    .subscribe(
      type => {
        this.filterValues.type = type;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    )
}

  getFilterPredicate() {
    return (row: ToolRequest, filters: string):boolean => {
      const matchFilter = [];
      const searchTerms = JSON.parse(filters);
      // verify fetching data by our searching values
      console.log(searchTerms);
      console.log(row.description.toLowerCase(),searchTerms.text);
      const customFilterTxt = (searchTerms.text)?row.description.replace(/<[^>]*>/g, '').toLowerCase().includes(searchTerms.text):true;
      console.log(row.statut.value,searchTerms.status);
      const customFilterStatus = (searchTerms.status)?row.statut.value == searchTerms.status:true;
      console.log(row.requestType);
      console.log(searchTerms.type);
      const customFilterType = (searchTerms.type)?row.requestType.toString()== searchTerms.type:true;
      // push boolean values into array
      matchFilter.push(customFilterTxt,customFilterStatus,customFilterType);
console.log(matchFilter);
      // return true if all values in array is true
      // else return false
      console.log(matchFilter.every(Boolean));
      return matchFilter.every(Boolean);
      // return true;
    };
  }

  clearFilter() {
    this.statusFilter.setValue('');
    this.requestTypeFilter.setValue('');
    this.textDescriptFilter.setValue('');
  }

  exportAsPdf(divToExport: string) {
    const doc = new jsPDF();
    const data: HTMLElement = document.getElementById(divToExport);
    html2canvas(data).then(canvas => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;

      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);

      PDF.save('angular-demo.pdf');
    });
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  // filterBy() {
  //   const filterValue = `${this.formSearch.get('statusFilter').value}$${
  //     this.formSearch.get('text').value
  //   }`;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  changeAffectation(event, row) {
    this.toolService.updateAffectation(row, event).then((res: any) => {
      this.updateData();
    });
  }
}
