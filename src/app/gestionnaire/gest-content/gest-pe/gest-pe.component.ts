import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileFunction } from '@app/_helpers/file.functions';

@Component({
  selector: 'app-gest-pe',
  templateUrl: './gest-pe.component.html',
  styleUrls: ['./gest-pe.component.css']
})
export class GestPeComponent implements OnInit {
  getList: any;
  isSet: boolean = false;
  constructor(private fileFunction: FileFunction, private router: Router) { }

  ngOnInit(): void {
  }
  async onFileSelected(event: any) {
    this.getList = await this.fileFunction.getCsv(event);
    this.isSet = true;
  }
  showImportInfo() {

  }
  startPe() {
    console.log(this.getList);
    this.router.navigate(['/app-stickers-of'], {
      state: {
        data: this.getList
      }
    });
  }
}
