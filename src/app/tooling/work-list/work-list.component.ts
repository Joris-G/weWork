import { Component, OnInit } from '@angular/core';
import { ToolService } from '@app/service/tool.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '@app/service/user.service';
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
}

@Component({
  selector: 'app-work-list',
  templateUrl: './work-list.component.html',
  styleUrls: ['./work-list.component.css']
})

export class WorkListComponent implements OnInit {
  filterStatusItems = FILTER_STATUS_VALUES;
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
    'toolNumber',
    'description',
    'dateBesoin',
    'groupeAffectation',
    'statut',
    'dateExecution',
    'downloadPdf'
  ];
  formSearch: FormGroup;
  tools: any[];
  users: any[];
  activateModify: boolean = false;
  constructor(
    private toolService: ToolService,
    public formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    document.addEventListener('keydown', () => {
      if (this.user.role == 2) {
        this.activateModify = !this.activateModify;
      }
    });
    this.formSearch = this.formBuilder.group({
      text: [''],
      statusFilter: [',']
    });

    this.updateData();

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
        this.dataSource = new MatTableDataSource(buildToolRequestList);
        this.dataSource.filterPredicate = this.getFilterPredicate();
      },
      () => {
        console.error('error tool request list');
      }
    );
  }



  getFilterPredicate() {
    return (row: ToolRequest, filters: string) => {
      // split string per '$' to array
      //console.log(row, filters);
      const filterArray = filters.split('$');
      //console.log(filterArray);
      const text = filterArray[1];
      const status = filterArray[0];
      const groupAffect = filterArray[2];
      const matchFilter = [];

      // Fetch data from row
      const columnText = row.description;
      const columnStatus = row.statut.value;

      // verify fetching data by our searching values
      const customFilterTxt = columnText.toLowerCase().includes(text);
      const customFilterStatus = columnStatus.toString() == status;

      // push boolean values into array
      matchFilter.push(customFilterTxt);
      matchFilter.push(customFilterStatus);

      // return true if all values in array is true
      // else return false
      return matchFilter.every(Boolean);
    };
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  filterBy() {
    const filterValue = `${this.formSearch.get('statusFilter').value}$${
      this.formSearch.get('text').value
    }`;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  changeAffectation(event, row) {
    this.toolService.updateAffectation(row, event).then((res: any) => {
      this.updateData();
    });
  }
}
