import { Component, OnInit } from '@angular/core';
import { ToolService } from '@app/service/tool.service';
import * as Chart from 'chart.js';
import { ToolRequest } from '@app/_models/tool-request';

function notFinishRequest(request) {
  return request.STATUT != 3;
}

function inWorkRequest(request) {
  return request.STATUT == 2;
}

function pendingRequest(request) {
  return request.STATUT == 1;
}
function newRequest(request) {
  return request.STATUT == 0;
}

function endThisWeekRequest(request) {
  if (!request.DATE_REALISATION) return false;
  const weekNumber = getWeekNumber();
  // console.log(`Numéro de la semaine du jour : ${weekNumber}`);
  const endDateWeekNumber = getWeekNumber(request.DATE_REALISATION);
  // console.log(`Numéro de la semaine de réalisation : ${weekNumber}`);
  return weekNumber == endDateWeekNumber;
}
function newThisWeekRequest(request) {
  const weekNumber = getWeekNumber();
  // console.log(`Numéro de la semaine du jour : ${weekNumber}`);
  const newDateWeekNumber = getWeekNumber(request.DATE_DEMANDE);
  // console.log(`Numéro de la semaine de réalisation : ${weekNumber}`);
  return weekNumber == newDateWeekNumber;
}

function getWeekNumber(date: string = undefined) {
  //find the year of the entered date
  // console.log(date);
  let date1;
  if (date) {
    date1 = new Date(date);
  } else {
    date1 = new Date();
  }
  // console.log(date1);
  const oneJan = new Date(date1.getFullYear(), 0, 1);
  // calculating number of days in given year before the given date
  const numberOfDays = Math.floor(
    (date1.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000)
  );
  // adding 1 since to current date and returns value starting from 0
  return Math.ceil((date1.getDay() + 1 + numberOfDays) / 7);
}

@Component({
  selector: 'app-sr',
  templateUrl: './sr.component.html',
  styleUrls: ['./sr.component.css']
})
export class SrComponent implements OnInit {
  toolRequestList: ToolRequest[];

  openRequestCount: number;
  newRequestCount: number;
  pendingRequestCount: number;
  inWorkRequestCount: number;

  endThisWeekCount: any;
  newThisWeekCount: number;

  repartionGraph: Chart;
  evolOpenGraph: Chart;
  evolOpenGraph2: Chart;
  constructor(private toolService: ToolService) {}

  ngOnInit(): void {
    // this.toolService.getToolRequestList().then((toolRequestList: any[]) => {
      // this.toolRequestList = toolRequestList;
      this.toolService.getToolRequestList().then(res=>{
        this.toolRequestList = res;
      })
      this.initStats();
      this.initGraph();
    // });
  }

  initStats() {
    this.openRequestCount = this.toolRequestList.filter(
      notFinishRequest
    ).length;
    console.log(this.openRequestCount);
    this.inWorkRequestCount = this.toolRequestList.filter(inWorkRequest).length;
    console.log(this.inWorkRequestCount);
    this.endThisWeekCount = this.toolRequestList.filter(
      endThisWeekRequest
    ).length;
    console.log(this.endThisWeekCount);
    this.newThisWeekCount = this.toolRequestList.filter(
      newThisWeekRequest
    ).length;
    console.log(this.newThisWeekCount);
    this.newRequestCount = this.toolRequestList.filter(newRequest).length;
    console.log(this.newRequestCount);
    this.pendingRequestCount = this.toolRequestList.filter(
      pendingRequest
    ).length;
    console.log(this.pendingRequestCount);
  }

  initGraph() {
    this.initRepartionGraph();
    this.initEvolOpen();
  }
  initEvolOpen(): any {
    this.evolOpenGraph2 = new Chart('graphOpenRequest2', {
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Evolution des demandes',
            position: 'top',
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0
              },
              scaleLabel: {
                labelString: `nombre de demandes`,
                display: true,
              },
              display: true,
            }
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: `numéro de la semaine`
              }
            }
          ]
        }
      },
      type: 'line',
      data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8],
        datasets: [
          {
            label: 'Demandes ouvertes',
            data: [10, 20, 30, 25, 15, 10, 15, 15]
          }
        ]
      }
    });
    this.evolOpenGraph = new Chart('graphOpenRequest', {
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Evolution des demandes',
            position: 'top',
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0
              },
              scaleLabel: {
                labelString: `nombre de demandes`,
                display: true,
              },
              display: true,
            }
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: `numéro de la semaine`
              }
            }
          ]
        }
      },
      type: 'line',
      data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8],
        datasets: [
          {
            label: 'Demandes ouvertes',
            data: [10, 20, 30, 25, 15, 10, 15, 15]
          }
        ]
      }
    });
  }

  initRepartionGraph(): any {
    this.repartionGraph = new Chart('camembertRequest', {
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Graphique camembert répartition des demandes ouvertes',
            position: 'top'
          }
        }
      },
      type: 'doughnut',
      data: {
        labels: ['nouvelle', 'à faire', 'En cours de réalisation'],
        datasets: [
          {
            label: 'répartition des demandes',
            data: [
              this.newRequestCount,
              this.pendingRequestCount,
              this.inWorkRequestCount
            ],
            backgroundColor: ['green', 'blue', 'orange']
          }
        ]
      }
    });
  }
}
