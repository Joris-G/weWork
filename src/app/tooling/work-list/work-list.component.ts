import { Component, OnInit, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { ToolService } from '@app/service/tool.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { DomSanitizer } from '@angular/platform-browser';
import { ToolRequest } from '@app/_models/tool-request';
import { UserService } from '@app/service/user.service';

@Component({
  selector: 'app-work-list',
  templateUrl: './work-list.component.html',
  styleUrls: ['./work-list.component.css']
})

export class WorkListComponent implements OnInit, AfterViewInit, OnChanges {


  program: string;
  programlist: any;

  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild('requestListPan') requestListPan: any;
  showClosedRequests: boolean = false
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
  dataSource: MatTableDataSource<any>;

  displayedColumns = [
    'id',
    'dateDemande',
    'demandeur',
    'program',
    'description',
    'dateBesoin',
    'affectedTo',
    'statut',
    'dateExecution',
  ];

  filterStatusItems = [
    { viewValue: 'non affectée', value: '0' },
    { viewValue: 'à faire', value: '1' },
    { viewValue: 'en cours de travaux', value: '2' },
    { viewValue: 'terminée', value: '3' }
  ];

  selectedRequest: ToolRequest;
  editModeActive: boolean = false;
  textDescriptFilter = new FormControl('');
  statusFilter = new FormControl('');
  requestTypeFilter = new FormControl('');
  filterValues: any = {
    status: '',
    type: '',
    text: ''
  }
  tools: any[];
  users: any[];
  activateModify: boolean = false;
  toolRequestList: ToolRequest[];





  constructor(
    private toolService: ToolService,
    public formBuilder: FormBuilder,
    public sanitizer: DomSanitizer,
    private userService : UserService,
  ) {
    console.log('constructor');
    // this.programService.getAllPrograms().then(programList => {
    //   this.programlist = programList;
    //   console.log(this.programlist);
    // });
  }


  ngOnInit(): void {
    console.log('init');
    this.dataSource = new MatTableDataSource<any>();
    this.dataSource.data = [];
    this.getDataSource().then((response: any) => {
      this.dataSource.data = response;
      this.dataSource.filterPredicate = this.getFilterPredicate();
      this.fieldListener();
    });
  }


  ngAfterViewInit(): void {
    console.log('afterviewInit');
  }


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('change');
  }


  getDataSource() {
    return new Promise<any[]>((resolve, reject) => {
      this.toolService.getToolRequestList().then((resRequestList: ToolRequest[]) => {
        if (resRequestList) {
          resolve(resRequestList);
        } else {
          reject('error');
        }
      });
    });
  }


  transformStatus(statusNumber: string): any {
    const newStatus = this.filterStatusItems.find(status => status.value == statusNumber);
    return newStatus;
  }


  updateListEvent() {
    this.requestListPan.expanded = true;
  }


  private fieldListener() {
    this.statusFilter.valueChanges.subscribe(status => {
      this.filterValues.status = status;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
    this.textDescriptFilter.valueChanges.subscribe(text => {
      this.filterValues.text = text;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
    this.requestTypeFilter.valueChanges.subscribe(type => {
      this.filterValues.type = type;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
  }


  getFilterPredicate() {
    return (toolRequest: ToolRequest, filters: string): boolean => {
      const matchFilter = [];
      const searchTerms = JSON.parse(filters);
      // verify fetching data by our searching values
      const customFilterTxt = (searchTerms.text) ? toolRequest.getRequestDescription().replace(/<[^>]*>/g, '').toLowerCase().includes(searchTerms.text) : true;
      const customFilterStatus = (searchTerms.status) ? toolRequest.getStatus() == searchTerms.status : true;
      const customFilterType = (searchTerms.type) ? toolRequest.getType().toString() == searchTerms.type : true;
      // push boolean values into array
      matchFilter.push(customFilterTxt, customFilterStatus, customFilterType);
      // return true if all values in array is true
      // else return false
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


  /**
   *Contrôle du rôle. Si secteur != OUTILLAGE impossible d'ouvrir sauf si User = Créateur
   *
   * @param {*} request
   * @memberof WorkListComponent
   */
  requestClickEvent(request: ToolRequest) {
    if(this.userService.isUserSector(1) || this.userService.isSameUser(request.requestor) ){
      this.selectedRequest = request;
      this.requestListPan.expanded = false;
    }else{
      console.error(`Vous n'êtes pas autorisé à accéder à cette demande`);

    }
  }


  defineRowClass(requestType: string): string {
    switch (requestType) {
      case '1':
        return 'row-sbo';

      case '2':
        return 'row-maintenance';

      case '3':
        return 'row-control-3D';

      default:
        break;
    }
  }
}

