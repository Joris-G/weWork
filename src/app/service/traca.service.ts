import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TracaService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  confStep(step: any, user: any) {
    //console.log(step);
    return this.http.get(
      `${this.baseUrl}/confStep.php?idProdStep=${step.prodStep.ID_PROD_STEP}&user=${user.MATRICULE}`
    );
  }

  confSubOperation(subOperation: any) {
    //console.log(subOperation);
    return this.http.get(
      `${this.baseUrl}/confSubOpe.php?idProdSubOpe=${subOperation.prodSubOperation.ID_PROD_SUBOP}`
    );
  }
  /**
   *
   * @param tracas
   * @param step On doit mettre une step
   * @returns
   */
  saveTracaControl(tracas: any[], step: any) {
    console.log(step, tracas);
    return new Promise<void>((resolve, reject) => {
      tracas.map((traca,index) => {
        this.http
        .get(`${this.baseUrl}/recordTraca.php?tracaType=controle&idProdStep=${step.prodStep.ID_PROD_STEP}&idTraca=${traca.ID_TRACA}&idTracaControle=${traca.ID_TRACA_CONTROLE}&idEcme=${traca.prodTracaDetail.TOOL? traca.prodTracaDetail.TOOL.ID_ECME: undefined}&sanction=${traca.prodTracaDetail.SANCTION}&dateExection=${traca.dateExecution}&comment=${traca.prodTracaDetail.COMMENTAIRE}`).subscribe(res=>{
          console.log(traca.ORDRE,tracas.length);
          if(index==(tracas.length-1)){
            console.log('resolve');
            resolve();
          }
        })
      });

    });
      }

  saveTracaMatiere(traca: any, subOperation: any) {
    return this.http.get(
      `${this.baseUrl}/recordTraca.php?tracaType=matiere&idProdSubOp=${subOperation.PROD.ID_PROD_SUBOP}&idTraca=${traca.idTraca}&idTracaMatiere=${traca.idTracaMatiere}&idMat=${traca.idMatiere}&sanction=${traca.prodTracaDetail.sanction}&dateExecution=${traca.dateExecution}&comment=${traca.comment}`
    );
  }

  saveTracaOf(traca: any, step: any) {
    return this.http.get(
      `${this.baseUrl}/recordTraca.php?tracaType=of&idProdStep=${step.prodStep.ID_PROD_STEP}&idTraca=${traca.idTraca}&idTracaOf=${traca.idTracaOf}&recordedOf=${traca.recordedOf}&sanction=${traca.sanction}&dateExecution=${traca.dateExecution}&comment=${traca.comment}`
    );
  }

  getPreviousTraca(idTraca: number) {
    return this.http.get(
      `${this.baseUrl}/getPreviousTraca.php?tracaType=mesure&idTraca=${idTraca}`
    );
  }

  addOperationTime(prodOperation: any) {
    // const duree =this.endPointOpeartion.getTime() - this.startPointOperation.getTime();
    //console.log(duree);
  }
}
