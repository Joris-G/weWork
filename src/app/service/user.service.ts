import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '@app/_models/user';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  isSameUser(userToTest: User): boolean {
    console.log(userToTest, this.user);
    return (userToTest.matricule == this.user.matricule);
  }


  isUserSector(sectorIdToTest: number): boolean {
    return (this.user.sector.idSector == sectorIdToTest-1);

  }

  user:User;
  userList:User[] = [];
  baseUrl = environment.apiUrl;

  constructor(
    private http:HttpClient,
    private authenticationService: AuthenticationService
    ){
    this.getUsersListByRole().then((userList:any[])=>{
      // console.log(userList);
      userList.forEach(resUser => {
        const user = new User(resUser);
        this.userList.push(user);
      });
    });
    this.user= this.authenticationService.currentUser;
   }



  getUsersListByRole(role:number=null){
    return new Promise((resolve,reject)=>{
      this.http.get(`${this.baseUrl}/user.php?typeOperation=usersListByRole&role=${role}`)
      .subscribe((res:any[])=>{
        resolve(res);
      });
    });
  }

  async getUserById(idUser: any): Promise<User> {
    return await new Promise((resolve,reject)=>{
      this.http.get(`${this.baseUrl}/user.php?typeOperation=userById&idUser=${idUser}`)
      .subscribe((res:User)=>{
        resolve(res);
      });
    });
  }


  getUsersListByTeam(team:number=null): Promise<User[]>{
    return new Promise((resolve,reject)=>{
      this.http.get(`${this.baseUrl}/user.php?typeOperation=usersListByTeam&team=${team}`)
      .subscribe((res:any)=>{
        const arrUsers:User[]=[];
        res.forEach(strUser => {
          arrUsers.push(new User(strUser));
        });
        resolve(arrUsers);
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
