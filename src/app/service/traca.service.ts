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

  confStep(step: any,coUsers:any) {
   console.log(coUsers);
    return this.http.get(
      `${this.baseUrl}/confStep.php?idProdStep=${step.prodStep.ID_PROD_STEP}&coUsers=${coUsers.map(coUser=> coUser.MATRICULE)}`
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
  saveTracaControl(traca: any, step: any) {
    console.log(step, traca);
    return this.http.get(`${this.baseUrl}/recordTraca.php?tracaType=controle&idProdStep=${step.prodStep.ID_PROD_STEP}&idTraca=${traca.ID_TRACA}&idTracaControle=${traca.ID_TRACA_CONTROLE}&idEcme=${traca.prodTracaDetail.ECME? traca.prodTracaDetail.ECME.ID_ECME: undefined}&prodTracaDetailSanction=${traca.prodTracaDetail.SANCTION}&dateExection=${traca.dateExecution}&comment=${traca.prodTracaDetail.COMMENTAIRE}`);
      }

      updateTracaControl(tracas: any[], step: any,user:any) {
        console.log( tracas);
        return new Promise<void>((resolve, reject) => {
          tracas.map((traca,index) => {
            this.http
            .get(`${this.baseUrl}/updateTraca.php?tracaType=controle&idProdTracaControle=${traca.prodTracaDetail.ID_PROD_TRACA_CONTROLE}&userMod=${user.MATRICULE}&idEcme=${traca.prodTracaDetail.ECME? traca.prodTracaDetail.ECME.ID_ECME: undefined}&prodTracaDetailSanction=${traca.prodTracaDetail.SANCTION}&comment=${traca.prodTracaDetail.COMMENTAIRE}`).subscribe(res=>{
              //console.log(traca.ORDRE,tracas.length);
              if(index==(tracas.length-1)){
                //console.log('resolve');
                resolve();
              }
            })
          });
        });
          }

  saveTracaMatiere(traca: any, step: any) {
    return this.http.get(
      `${this.baseUrl}/recordTraca.php?tracaType=matiere&idProdStep=${step.prodStep.ID_PROD_STEP}&idTraca=${traca.ID_TRACA}&idTracaMatiere=${traca.ID_TRACA_MATIERE}&idMat=${traca.prodTracaDetail.ID_MATIERE}&prodTracaDetailSanction=${traca.prodTracaDetail.SANCTION}&dateExecution=${traca.dateExecution}&comment=' '`
    );
  }
  updateTracaMatiere(traca: any,user:any) {
    return this.http.get(
      `${this.baseUrl}/updateTraca.php?tracaType=matiere&idProdTracaMatiere=${traca.prodTracaDetail.ID_PROD_TRACA_MATIERE}&userMod=${user.MATRICULE}&idMat=${traca.prodTracaDetail.ID_MATIERE}&prodTracaDetailSanction=${traca.prodTracaDetail.SANCTION}&comment=${traca.comment}`
    );
  }

  saveTracaOf(traca: any, step: any) {
    return this.http.get(
      `${this.baseUrl}/recordTraca.php?tracaType=of&idProdStep=${step.prodStep.ID_PROD_STEP}&idTraca=${traca.ID_TRACA}&idTracaOf=${traca.ID_TRACA_OF}&recordedOf=${(traca.prodTracaDetail.OF.length)?traca.prodTracaDetail.OF:''}&prodTracaDetailSanction=1&dateExecution=${traca.dateExecution}&comment=${traca.comment}`
    );
  }

  updateTracaOf(traca: any, user: any): any {
    return this.http.get(
      `${this.baseUrl}/updateTraca.php?tracaType=of&userMod=${user.MATRICULE}&idProdTracaOf=${traca.prodTracaDetail.ID_PROD_TRACA_OF}&recordedOf=${traca.prodTracaDetail.OF}&prodTracaDetailSanction=${traca.SANCTION}&comment=${traca.comment}`
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
