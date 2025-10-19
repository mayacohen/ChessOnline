import { Component, Input, ChangeDetectorRef } from '@angular/core';
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
    constructor(private client:Client, private cdr:ChangeDetectorRef){}
  openUserView(username:string | null)
  {
    if (username === null) return;
    this.client.getLoggedUserDetails(username).subscribe({
      next: user => {
        this.user = user;
        this.isUserView = true;
        this.cdr.detectChanges();
      },
      error: err => console.log(err)
    });
  }
  closeUserView()
  {
    this.isUserView=false;
    this.cdr.detectChanges();
  }
}
