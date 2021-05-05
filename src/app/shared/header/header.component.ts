import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: any;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,

  ) {

    this.user= this.authenticationService.currentUser;

  }

  ngOnInit(): void {
    //console.log(this.user);
  }
  logout() {
    this.authenticationService.logout();
  }
}
