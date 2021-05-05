import { Component, Input, OnInit } from '@angular/core';
import { RoleService } from '@app/service/role.service';
import { Role } from '@app/_interfaces/role';

@Component({
  selector: 'app-userbar',
  templateUrl: './userbar.component.html',
  styleUrls: ['./userbar.component.css']
})
export class UserbarComponent implements OnInit {
  @Input() user: any;
  time: any;
  roleList: Role[];
  role: string;
  constructor(private roleService: RoleService) {

  }

  ngOnInit(): void {
    //TIME
    this.time = this.syncTime();
    setTimeout(() => {
      this.time = this.syncTime();
      const minuteTxt = () => {
        if (this.time.minute < 10) {
          return `0${this.time.minute}`;
        } else {
          return this.time.minute;
        }
      }
      setInterval(() => {
        this.time = this.syncTime();
      }, 60000);
    }, (60 - this.time.second) * 1000);
    //Role
    this.roleService.getRole().subscribe((res: any) => {
      this.roleList = res;
      this.role = this.roleList.find(role => role.ID_ROLE == this.user.ROLE).ROLE;
    });
  }

  syncTime() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    return { 'hour': hour, 'minute': minute, 'second': second }
  }
}
