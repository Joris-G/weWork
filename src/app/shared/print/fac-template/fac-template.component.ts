import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fac-template',
  templateUrl: './fac-template.component.html',
  styleUrls: ['./fac-template.component.css']
})
export class FacTemplateComponent implements OnInit {
  @Input() facData: any;
  constructor(private router: Router) {
    const data = this.router.getCurrentNavigation().extras.state.data;
    console.log(data);
    this.facData = data;
  }

  ngOnInit(): void {
  }

}
