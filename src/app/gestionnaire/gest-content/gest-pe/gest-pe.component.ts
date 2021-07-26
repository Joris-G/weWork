import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileFunction } from '@app/_helpers/file.functions';
import { MatDialog } from '@angular/material/dialog';
import { DialogGestPeInfoTemplateComponent } from '@app/shared/dialog/dialog-gest-pe-info-template/dialog-gest-pe-info-template.component';

@Component({
  selector: 'app-gest-pe',
  templateUrl: './gest-pe.component.html',
  styleUrls: ['./gest-pe.component.css']
})
export class GestPeComponent implements OnInit {
  getList: any;
  isSet: boolean = false;
  constructor(
    private fileFunction: FileFunction,
    private router: Router,
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
  }
  async onFileSelected(event: any) {
    this.getList = await this.fileFunction.getCsv(event);
    this.isSet = true;
  }
  showImportInfo() {
    const dialogRef = this.dialog.open(DialogGestPeInfoTemplateComponent);
    dialogRef.afterClosed().subscribe(
      // data => {
      // console.log(data);
    // }
    )
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
