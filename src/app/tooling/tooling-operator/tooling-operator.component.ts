import { Component, OnInit } from '@angular/core';
import { ToolService } from '@app/service/tool.service';
import { UserService } from '@app/service/user.service';
import { MatTableDataSource } from '@angular/material/table';

const FILTER_STATUS_VALUES = [
  { viewValue: 'à faire', value: 1 },
  { viewValue: 'non affecté', value: 0 },
  { viewValue: 'en cours de travaux', value: 2 },
  { viewValue: 'terminé', value: 3 }
];

@Component({
  selector: 'app-tooling-operator',
  templateUrl: './tooling-operator.component.html',
  styleUrls: ['./tooling-operator.component.css']
})
export class ToolingOperatorComponent implements OnInit {
  filterStatusItems = FILTER_STATUS_VALUES;
  dataSource: MatTableDataSource<any>;
  tools: any[];
  users: any[];
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
  constructor(private toolService: ToolService,
    private userService: UserService) { }

  ngOnInit(): void {

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
        // this.dataSource.filterPredicate = this.getFilterPredicate();
      },
      () => {
        console.error('error tool request list');
      }
    );
  }
}
