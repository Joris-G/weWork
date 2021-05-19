import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/service/authentication.service';
import { ToolService } from '@app/service/tool.service';


@Component({
  selector: 'app-new-tooling-request',
  templateUrl: './new-tooling-request.component.html',
  styleUrls: ['./new-tooling-request.component.css']
})
export class NewToolingRequestComponent implements OnInit{





  constructor() { }
  ngOnInit(): void {



  }



}
