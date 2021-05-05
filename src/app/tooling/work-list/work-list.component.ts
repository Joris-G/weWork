import { Component, OnInit } from '@angular/core';


const WORKLIST = [{
  id:1,
  dateDemande:'10-03-2021',
  demandeur: 'J.GRANGIER',
  toolNumber:'OT096788',
  description:'Texte descriptif de la demande',
  dateBesoin:'15-03-2021',
  statut:1,
  dateExecution:'15-03-2021',
  groupeAffectation:'Fraisage',
},
{
  id:2,
  dateDemande:'13-03-2021',
  demandeur: 'D.CABANEL',
  toolNumber:'OT098790',
  description:'Changer les staublis',
  dateBesoin:'25-05-2021',
  statut:0,
  dateExecution:'',
  groupeAffectation:'Soudure',
},];


@Component({
  selector: 'app-work-list',
  templateUrl: './work-list.component.html',
  styleUrls: ['./work-list.component.css']
})
export class WorkListComponent implements OnInit {
dataSource = WORKLIST;
displayedColumns=['id','dateDemande','demandeur','toolNumber','description','dateBesoin','groupeAffectation','statut','dateExecution']
  constructor() { }

  ngOnInit(): void {
  }

}
