import { Component, OnInit } from '@angular/core';
import { ToolService } from '@app/service/tool.service';


const WORKLIST = [{
  id:'1',
  dateDemande:'10-03-2021',
  demandeur: 'J.GRANGIER',
  toolNumber:'OT096788',
  description:'Texte descriptif de la demande',
  dateBesoin:'15-03-2021',
  statut:'1',
  dateExecution:'15-03-2021',
  groupeAffectation:'Fraisage',
},
{
  id:'2',
  dateDemande:'13-03-2021',
  demandeur: 'D.CABANEL',
  toolNumber:'OT098790',
  description:'Changer les staublis',
  dateBesoin:'25-05-2021',
  statut:'0',
  dateExecution:'',
  groupeAffectation:'Soudure',
},];


@Component({
  selector: 'app-work-list',
  templateUrl: './work-list.component.html',
  styleUrls: ['./work-list.component.css']
})
export class WorkListComponent implements OnInit {
dataSource:any=[];
displayedColumns=['id','dateDemande','demandeur','toolNumber','description','dateBesoin','groupeAffectation','statut','dateExecution']

constructor(private toolService : ToolService) { }

  ngOnInit(): void {
this.toolService.getToolRequestList().then((toolRequestList:any[])=>{
  console.log(toolRequestList);
  const buildToolRequestList = []
  toolRequestList.forEach(toolRequest => {
    buildToolRequestList.push({
      id: toolRequest.ID_TOOLING_REQUEST,
      dateDemande: toolRequest.DATE_DEMANDE,
      demandeur: toolRequest.ID_USER,
      toolNumber: toolRequest.ID_TOOL,
      description: toolRequest.DESCRIPTION,
      dateBesoin: toolRequest.DATE_BESOIN,
      statut: toolRequest.STATUT,
      dateExecution: toolRequest.DATE_REALISATION,
      groupeAffectation: toolRequest.GROUPE_AFFECTATION,
    });
    console.log(toolRequest);
  });
  this.dataSource=buildToolRequestList;
},
()=>{
  console.error('error tool request list');
})
  }

}
