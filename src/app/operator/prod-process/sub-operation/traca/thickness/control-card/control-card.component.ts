import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-control-card',
  templateUrl: './control-card.component.html',
  styleUrls: ['./control-card.component.css']
})
export class ControlCardComponent implements OnInit, OnChanges {

  _previousDatas: any = [];

  @Input() set previousDatas(value: any) {
    this._previousDatas = value;
    let points: number[] = [];
    let legend: string[] = [];
    let tolMax: number[] = [];
    let tolMin: number[] = [];
    let label: string;
    console.log(this.previousDatas);
    this.previousDatas.forEach(data => {
      legend.push(data.part);
      points.push(data.mesure.VALEUR);
      tolMax.push(data.mesure.DEF.VAL_MAX);
      tolMin.push(data.mesure.DEF.VAL_MIN);
      label = data.mesure.DEF.NOM_MESURE;
    });
    this.drawControlCard(points, tolMax, tolMin, legend, label);
  }

  get previousDatas(): any {
    return this._previousDatas;
  }
  drawControlCard(points: number[], tolMax: number[], tolMin: number[], legend: string[], label: string) {
    let controlCardChart = new Chart('controlCardChart', {
      type: 'line',
      data: {
        labels: legend,
        datasets: [
          {
            data: points,
            label: label,
            fill: false,
            borderColor: 'deeppink',
            pointBorderWidth: 5,

          },
          {
            data: tolMax,
            label: 'Tolérance Max',
            fill: false,
            borderColor: 'rgb(255,0,0)',
          },
          {
            data: tolMin,
            label: 'Tolérance Min',
            fill: false,
            borderColor: 'rgb(255,0,0)',
          },
        ]
      },
      options: {
        scales: {
          scaleLabel: {
            display: true,
          },
          yAxes: [{
            ticks: {
              fontColor: 'rgb(255,255,255)',
              // beginAtZero: true,
              suggestedMin: Math.min.apply(null, points),
            },
            gridLines: {
              color: 'rgb(255,255,255)',
            },
            scaleLabel: {
              fontColor: 'rgb(255,255,255)',
              labelString: 'épaisseur ( en mm )',
              display: true,
              fontSize: 18,
            },
          }],
          xAxes: [{
            ticks: {
              fontColor: 'rgb(255,255,255)',
            },
            gridLines: {
              color: 'rgb(255,255,255)',
            },
            scaleLabel: {
              fontColor: 'rgb(255,255,255)',
              labelString: "numéro d'OF",
              display: true,
              fontSize: 18,
            }
          }]
        },
        legend: {
          display: false,
        }
      }
    });
  }




  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.previousDatas) {
      this.previousDatas = changes.previousDatas.currentValue;
    }
  }

  ngOnInit(): void {

  }

}
