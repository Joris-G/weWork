import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  baseUrl = environment.apiUrl;
  allMaterials: any;


  constructor(private http: HttpClient) {
   }


  getMaterialList(): Observable<any> {
    return this.allMaterials = this.http.get(`${this.baseUrl}/getAllMaterials.php?`);
  }
  isKnownMaterial(testedMaterial) {
    return new Promise((resolve, reject) => {
      this.getMaterialList().subscribe((res: any) => {
        const mat = res.find(material => material.ID_MATIERE == testedMaterial);
        (mat) ? resolve(mat) : reject(`La matière scannée n'est pas la bonne`);
      })
    });
  }
  getMatDetails(idMat: string) {
    return this.http.get(`${this.baseUrl}/getMaterialDetails.php?idMat=${idMat}`);
  }

  recordMaterials(material:any){
    const datePer:Date = material.shelflife;
console.log(moment(datePer).format("YYYY-MM-DD"));
    return this.http.get(`${this.baseUrl}/recordMaterials.php?idMaterial=${material.matiere}&batchNumber=${material.batchNumber}&shelflife=${moment(datePer).format("YYYY-MM-DD")}&numberOfProducts=${material.numberOfProducts}`);
  }




}
