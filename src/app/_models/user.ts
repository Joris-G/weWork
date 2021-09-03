import { Role } from '@app/_interfaces/role';
import { AircraftProgram } from './aircraft-program';
import { Sector } from './sector';
import { Team } from './team';

export class User {
  idUser: number;
  lastName: string;
  firstName: string;
  matricule: number;
  role: Role;
  detailedRole: Role;
  sector: Sector;
  program: AircraftProgram;
  team: number;
  qrCode: boolean;
  password: string;
  lastConnexionDate: Date;
  selected:boolean;

  constructor(resUser:any){
    // console.log(resUser);
    this.idUser = resUser.ID_UTILISATEUR;
    this.lastName = resUser.NOM;
    this.firstName = resUser.PRENOM;
    this.matricule = resUser.MATRICULE;
    this.role = new Role(resUser.ROLE);
    this.detailedRole = resUser.ID_ROLE_DET;
    this.sector = new Sector(resUser.ID_SECTEUR);
    this.program = resUser.PROGRAMME_AFFECTATION;
    this.team = resUser.NUM_EQUIPE;
    this.qrCode = resUser.QRCODE;
    this.password = resUser.MOT_DE_PASSE;
    this.lastConnexionDate = resUser.DATE_DERNIERE_CONNEXION;
  }
}
