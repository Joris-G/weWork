import { Component, ComponentFactoryResolver, HostListener, OnInit, Type, ViewChild, AfterViewInit, ViewChildren, ViewContainerRef, QueryList } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './service/authentication.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  // title = 'iwork-app';
  user: any;
  // @ViewChildren(AlertComponent) alertContainer: QueryList<AlertComponent>;


  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,

  ) {

    this.user=this.authenticationService.currentUser






    window.addEventListener("beforeunload", ($event) => {
      if (!sessionStorage.getItem('currentUser')) {
        sessionStorage.clear();
      }
    });
  }

  ngOnInit(): void {
    if (sessionStorage.length == 0) {
      this.authenticationService.logout();
      this.router.navigate(['/app-login']);
    }
  }

  @HostListener("window:onbeforeunload", ["$event"])

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/app-login']);
  }


}
