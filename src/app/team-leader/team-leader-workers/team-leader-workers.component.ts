import { Component, OnInit, OnChanges } from '@angular/core';
import { UserService } from '@app/service/user.service';
import { User } from '@app/_models/user';
import { HttpClient } from '@angular/common/http';

// export interface User {
//   ID_UTILISATEUR: string,
//   NOM: string,
//   PRENOM: string,
//   MATRICULE: string,
//   ROLE: string,
//   ID_ROLE_DET: string,
//   ID_SECTEUR: string,
//   PROGRAMME_AFFECTATION: string,
//   NUM_EQUIPE: string,
//   QRCODE: string,
//   MOT_DE_PASSE: string,
//   DATE_DERNIERE_CONNEXION: string,
// }

@Component({
  selector: 'app-team-leader-workers',
  templateUrl: './team-leader-workers.component.html',
  styleUrls: ['./team-leader-workers.component.css']
})


export class TeamLeaderWorkersComponent implements OnInit, OnChanges {

  workersList: User[]
  userCheetActive: Boolean = false;
  currentUser: User;
  constructor(private userService: UserService, private http: HttpClient) { }

  ngOnInit(): void {
    this.userService.getUsersListByTeam().then(userList => {
      this.workersList = userList;
    });
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log(changes);
  }

  setCurrentUser(user: User) {
    if (this.userCheetActive != true) { this.userCheetActive = true };
    this.currentUser = user;
  }

  newUser() {
    if (this.userCheetActive != true) { this.userCheetActive = true };
    // this.currentUser = {
    //   ID_UTILISATEUR: '',
    //   NOM: '',
    //   PRENOM: '',
    //   MATRICULE: '',
    //   ROLE: '',
    //   ID_ROLE_DET: '',
    //   ID_SECTEUR: '',
    //   PROGRAMME_AFFECTATION: '',
    //   NUM_EQUIPE: '',
    //   QRCODE: '',
    //   MOT_DE_PASSE: '',
    //   DATE_DERNIERE_CONNEXION: '',
    // }
  }

  saveUser() {
    console.log(this.currentUser);
  }

}
