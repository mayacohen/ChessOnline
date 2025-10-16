import { Component, EventEmitter, Input, OnInit , ChangeDetectorRef, Output } from '@angular/core';
import { Client } from '../../services/client';
import { CommonModule } from '@angular/common';
import { LoggedUserReturnModel } from '../../models/logged-user-return-model';
@Component({
  selector: 'app-user-view',
  imports: [CommonModule],
  templateUrl: './user-view.html',
  styleUrl: './user-view.scss'
})
export class UserView implements OnInit{
  notFriend = "bi bi-star";
  friend = "bi bi-star-fill";
  @Output() closeModalEmitter = new EventEmitter<void>();
  @Input() user: LoggedUserReturnModel = {isFriend:null, isOnline:false, 
    dateJoined:"",userPic:"example.png",username:'guest', score:null}; 
  userStatus = this.user.isFriend? this.friend : this.notFriend;
  constructor(private client:Client, private cdr:ChangeDetectorRef){}
  isLogged = false;
  ngOnInit(): void {
    if (this.client.getLoggedInStatus())
      this.isLogged = true;
  }
  closeModal()
  {
    this.closeModalEmitter.emit();
  }
  unexpectedEventsHandler(event:Event)
  {
    event.stopPropagation();
    event.preventDefault();
  }
  changeFriendStatus()
  {
    if (this.user.isFriend === null)
    {
      console.log('bug');
      return;
    }
    if (this.user.isFriend)
    {
      this.client.removeFriend(this.user.username).subscribe({
        next: () => 
          {
            this.userStatus = this.notFriend;
            this.cdr.detectChanges(); 
          },
          error: err => console.log(err)
      });
    }
    else
    {
      this.client.addFriend(this.user.username).subscribe({
        next: () => 
          {
            this.userStatus = this.friend;
            this.cdr.detectChanges(); 
          },
          error: err => console.log(err)
      });
    }
  }
}
