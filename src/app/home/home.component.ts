import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.user=this.authenticationService.currentUser
      console.log(this.user);
      if(this.user){
      switch (this.user.ROLE) {
        //ADMIN
        case '1':
          this.router.navigate(['/app-home']);
          break;
        //CONTROLE
        case '2':
          this.router.navigate(['/app-operator']);
          break;
        //OPERATEUR
        case '3':
        this.router.navigate(['/app-operator']);
          break;
        //PREPARATEUR
        case '4':
        this.router.navigate(['/app-preparateur']);
          break;
        //GESTIONNAIRE
        case '5':
          this.router.navigate(['/app-gestionnaire']);
          break;
        //CHEF D'EQUIPE
        case '6':
          this.router.navigate(['/app-home']);
          break;
        //CHEF DE LIGNE
        case '7':
        this.router.navigate(['/app-home']);
          break;
        default:
        this.router.navigate(['/app-home']);
          break;
      }
    }
  }
}
