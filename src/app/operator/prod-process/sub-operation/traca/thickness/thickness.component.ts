import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TracaService } from '@app/service/traca.service';

@Component({
  selector: 'app-thickness',
  templateUrl: './thickness.component.html',
  styleUrls: ['./thickness.component.css']
})
export class ThicknessComponent implements OnInit {
  @Input() tracas: any;
  @Input() subOperation: any;
  previousDatas: any[];
  selectedPreviousDatas: any = [];
  selectedPoint: any;
  @ViewChild('inputThicknessValue') inputThicknessValue: ElementRef;

  constructor(private tracaService: TracaService) { }

  ngOnInit(): void {
    this.getAllPreviousDatas(this.tracas.ID_TRACA);
  }
  getAllPreviousDatas(idTraca: number) {
    this.tracaService.getPreviousTraca(idTraca).subscribe((res: any) => {
      this.previousDatas = res;
    });
  }
  getSelectedPointPreviousDatas(idPoint: string) {
    this.selectedPreviousDatas = [];
    this.previousDatas.forEach(previousData => {
      const previousPointMeasure = previousData.DATAS.filter(data => data.ID_TRACA_MESURE == idPoint);
      this.selectedPreviousDatas.push({ mesure: previousPointMeasure[0], part: previousData.ORDRE_FABRICATION });
    });
  }
  selectPoint(event: any) {
    this.selectedPoint = event;
    this.getSelectedPointPreviousDatas(event.ID_TRACA_MESURE)
  }
  newMeasureAction() {
    this.selectedPreviousDatas.push({ mesure: this.inputThicknessValue, part: 'NewOF' });
  }
}
