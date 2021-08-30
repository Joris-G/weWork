import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToolRequest, ToolRequestType } from '@app/_models/tool-request';
import { UserService } from './user.service';
import { User } from '@app/_models/user';
import { Tool } from '@app/_models/tool';

@Injectable({
  providedIn: 'root'
})
export class ToolService {
  getAllUsers(): any {

  }
  REQUEST_TYPES = [
    { viewValue: 'SBO', value: 1 },
    { viewValue: 'maintenance / amélioration', value: 2 },
    { viewValue: 'contrôle 3D', value: 3 },
  ]

  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private userService: UserService) {
  }

  addTool(sapNumber: number, designation: string, version: number = 1) {
    //console.log(`tool : ${sapNumber} , ${designation} , ${version}`);
    return new Promise((resolve, reject) => {
      this.http.get(`${this.baseUrl}/tooling.php?typeOperation=addTool&sapNumber=${sapNumber}&designation=${designation}&version=${version}`)
        .subscribe(res => {
          resolve(res);
        })
    });
  }


  /**
   *Date de la demande en automatique dans le PHP ou dans la table.
   *Statut 0 automatique dans le php ou dans la table
   *
   * @param {number} requestor
   * @param {number} idTool
   * @param {string} description
   * @param {number} needDate
   * @param {number} requestType
   * @return {*}
   * @memberof ToolService
   */
  addToolRequest(request: ToolRequest) {
    //console.log(`request : ${requestor} , ${idTool} ,${description} , ${needDate}`);
    // const transformedRequest = request;
    // transformedRequest.description = encodeURIComponent(request.description);
    // console.log(request.description);
    request.setRequestDescription(transformColorHexToRgb(request.getRequestDescription()));
    return new Promise((resolve, reject) => {
      this.http.get(`${this.baseUrl}/tooling.php?typeOperation=addToolRequest&request=${JSON.stringify(request)}`)
        .subscribe(res => {
          resolve(res);
        });
    });
  }


  updateRequest(request: ToolRequest) {
    return new Promise((resolve, reject) => {
      const copyRequest  = request;
      copyRequest.setRequestDescription(encodeURIComponent(copyRequest.getRequestDescription()));
      this.http.get(`${this.baseUrl}/tooling.php?typeOperation=updateRequest&request=${JSON.stringify(copyRequest)}`)
        .subscribe((res) => {
          (res) ? resolve(res) : reject();
        });
    });
  }

  getToolBySapNumber(sapNumber: string) {
    //console.log(`cherche Outillage : ${sapNumber}`);
    return new Promise((resolve: any, reject) => {
      this.http.get(`${this.baseUrl}/tooling.php?typeOperation=getToolBySapNumber&sapNumber=${sapNumber}`)
        .subscribe(res => {
          (res) ? resolve(res) : reject();
        });
    });
  }
  getToolById(id: number) {
    //console.log(`cherche Outillage : ${sapNumber}`);
    return new Promise((resolve: any, reject) => {
      this.http.get(`${this.baseUrl}/tooling.php?typeOperation=getToolById&idTool=${id}`)
        .subscribe(res => {
          console.log(res);
          (res) ? resolve(res) : reject();
        });
    });
  }

  getToolRequestList(): Promise<ToolRequest[]> {
    //console.log(`get toolRequestList`);
    let toolRequestList: ToolRequest[] = [];
    let requestUser: User;
    let affectedToUser: User;
    let realUser: User;
    return new Promise((resolve, reject) => {
      this.http.get(`${this.baseUrl}/tooling.php?typeOperation=getToolRequestList`)
        .subscribe((res: any[]) => {
          res.forEach(responseRequest => {
            const requestUser = this.userService.userList.find(user => user.idUser == responseRequest.ID_USER);
            const affectedToUser = this.userService.userList.find(user => user.idUser == responseRequest.AFFECTE_A);
            const realUser = this.userService.userList.find(user => user.idUser == responseRequest.REAL_USER_ID);
            const toolRequest = new ToolRequest();
            toolRequest.type = responseRequest.TYPE_DEMANDE;
              toolRequest.requestDescription= responseRequest.DESCRIPTION;
              toolRequest.requestDate = responseRequest.DATE_DEMANDE
              toolRequest.requestor = requestUser;
              toolRequest.needDate= responseRequest.DATE_BESOIN;
              toolRequest.affectedTo= affectedToUser;
              toolRequest.affectationDate= responseRequest.DATE_AFFECTATION;
              toolRequest.status= responseRequest.STATUT;
              toolRequest.idToolRequest= responseRequest.ID_TOOLING_REQUEST;
              toolRequest.tool = new Tool(responseRequest.ID_TOOL);
              toolRequest.imgName = responseRequest.IMG_URL;
              toolRequest.toolingNote = responseRequest.NOTE_TOOLING;
              toolRequest.realDate= responseRequest.DATE_REALISATION;
              toolRequest.realUser= (realUser) ? realUser : null;

            // console.log(toolRequest);
            toolRequestList.push(toolRequest);
          });
        });
      (toolRequestList) ? resolve(toolRequestList) : reject();
    });
  }
  async getToolsList() {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.baseUrl}/tooling.php?typeOperation=getToolsList`)
        .subscribe((res) => {
          (res) ? resolve(res) : reject();
        });
    });
  }



}

function hexToRGB(h) {
  let r = '0', g = '0', b = '0';

  // 3 digits
  if (h.length == 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];

    // 6 digits
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }
  console.log("rgb(" + +r + "," + +g + "," + +b + ")");
  return "rgb(" + +r + "," + +g + "," + +b + ")";
}

function transformColorHexToRgb(textToTransform: string) {
  let copyText = textToTransform;
  // const allColorsFound = [];
  let i;
  while ((i = copyText.indexOf('color:#')), i > -1) {
    const colorFound = textToTransform.substring(copyText.indexOf('color:#') + 6, copyText.indexOf('color:#') + 6 + 7);
    // allColorsFound.push(colorFound);
    console.log(colorFound);
    copyText = copyText.replace(colorFound, hexToRGB(colorFound))
    console.log(copyText);
    textToTransform = copyText;
    // copyText = '';
  }
  console.log(copyText);
  return textToTransform;
}

