import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '@app/service/user.service';
import { AuthenticationService } from '@app/service/authentication.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-user-list',
  templateUrl: './dialog-user-list.component.html',
  styleUrls: ['./dialog-user-list.component.css']
})
export class DialogUserListComponent implements OnInit {
  userList: any;
  user: any;
  selectedUsers: {}[];

  constructor(private userService: UserService, private authenticationService: AuthenticationService, private dialogRef: MatDialogRef<DialogUserListComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    console.log(data);
  }

  ngOnInit(): void {
    this.selectedUsers = [];
    this.user = this.authenticationService.currentUser;
    console.log(this.user);
    // this.selectedUsers.push(this.user);
    this.userService.getUsersListByTeam(this.user.NUM_EQUIPE).then(res => {
      this.userList = res;
      this.userList.map(user => {
        if (this.data.coUsers.find(coUser => coUser.MATRICULE == user.MATRICULE)) {
          user.selected = true;
          // this.selectedUsers.push(user);
        } else { user.selected = false }
      });
      console.log(this.userList);
    });
  }
  userClickAction(user: any) {
    if (user.selected) {
      user.selected = false;
      // const index = this.selectedUsers.indexOf(user);
      // console.log(index);
      // this.selectedUsers.splice(index);
    } else {
      // this.selectedUsers.push(user);
      user.selected = true;
    }
  }
  validateUsers() {
    this.userList.map(user=> {if(user.selected) {this.selectedUsers.push(user)}})
    this.dialogRef.close(this.selectedUsers);
  }
}
