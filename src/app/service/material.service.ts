import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  baseUrl = environment.apiUrl;
  allMaterials: any;


  constructor(private http: HttpClient) { }


  getMaterialList(): Observable<any> {
    this.allMaterials = this.http.get(`${this.baseUrl}/getAllMaterials.php?`);
    return this.allMaterials;
  }
  isKnownMaterial(testedMaterial) {
    return new Promise((resolve, reject) => {
      this.allMaterials.subscribe((res: any) => {
        const mat = res.find(material => material.ARTICLE_SAP == testedMaterial);
        (mat) ? resolve(mat) : reject(`La matière scannée n'est pas la bonne`);
      })
    });
  }
  getMatDetails(idMat: string) {
    return this.http.get(`${this.baseUrl}/getMaterialDetails.php?idMat=${idMat}`);
  }
}
