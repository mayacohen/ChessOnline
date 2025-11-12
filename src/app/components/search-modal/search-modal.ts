import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserView } from '../user-view/user-view';
import { LoggedUserReturnModel } from '../../models/logged-user-return-model';
import { Client } from '../../services/client';

@Component({
  selector: 'app-search-modal',
  imports: [CommonModule, UserView],
  templateUrl: './search-modal.html',
  styleUrl: './search-modal.scss'
})
export class SearchModal {
  @Input() userList: (string | null)[] = [];
  @Input() user: LoggedUserReturnModel = {isFriend:null, isOnline:false, 
    dateJoined:"",userPic:"example.png",username:'guest', score:null}; 
  isUserView = false;
    constructor(private client:Client, private cdr:ChangeDetectorRef,
      private router:Router){}
  openUserView(user:any)
  {
    this.user = user;
    this.isUserView = true;
    this.cdr.detectChanges();
  }
  recoursiveOpenUserView(username:string | null, time:number)
  {
    if (time > 1000 || username === null)
    {
      this.router.navigate(["/error"]); 
      return;
    }
    this.client.getLoggedUserDetails(username).subscribe({next: user =>
        this.openUserView(user),
      error: () => {
          setTimeout(() => this.recoursiveOpenUserView(username,time+100),time);
      }});
  }
  closeUserView()
  {
    this.isUserView=false;
    this.cdr.detectChanges();
  }
}
