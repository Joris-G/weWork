import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }



  getUsersListByRole(role:number=null){
    return new Promise((resolve,reject)=>{
      this.http.get(`${this.baseUrl}/user.php?typeOperation=usersListByRole&role=${role}`)
      .subscribe(res=>{
        resolve(res);
      });
    });
  }


  getUsersListByTeam(team:number=null){
    return new Promise((resolve,reject)=>{
      this.http.get(`${this.baseUrl}/user.php?typeOperation=usersListByTeam&team=${team}`)
      .subscribe(res=>{
        resolve(res);
      });
    });
  }

  findUser(affaire:number,userList:any[]):any{
for (const user of userList) {
  const programList:[] = user['PROGRAMME_AFFECTATION'].split(',');
  const findProgram = programList.find(program=>program==affaire);
  if(findProgram) {
    return user;
  }else{
    return false;
  }
}
  }

}