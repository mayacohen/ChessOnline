import { Component, EventEmitter, Input, OnInit , ChangeDetectorRef, Output } from '@angular/core';
import { Client } from '../../services/client';
import { CommonModule } from '@angular/common';
import { LoggedUserReturnModel } from '../../models/logged-user-return-model';
import { Chat } from '../chat/chat';
import { LoggedInUserModel } from '../../models/logged-in-user-model';
import { RequestGameModal } from '../request-game-modal/request-game-modal';
@Component({
  selector: 'app-user-view',
  imports: [CommonModule, Chat, RequestGameModal],
  templateUrl: './user-view.html',
  styleUrl: './user-view.scss'
})
export class UserView implements OnInit{
  // notFriend = "bi bi-star";
  // friend = "bi bi-star-fill";
  @Output() closeModalEmitter = new EventEmitter<void>();
  @Input() user: LoggedUserReturnModel = {isFriend:null, isOnline:false, 
    dateJoined:"",userPic:"example.png",username:'guest', score:null}; 
//  userStatus = this.user.isFriend? this.friend : this.notFriend;
    userChat: LoggedInUserModel = {username : '', 
      userImg: 'example.png', id:'', score:0};
  isChatModalOpen = false;
  isRequestModal = false;
  constructor(private client:Client, private cdr:ChangeDetectorRef){}
  isLogged = false;
  ngOnInit(): void {
    if (this.client.getLoggedInStatus())
      this.isLogged = true;
    this.userChat.username = this.user.username;
    this.userChat.score = this.user.score?? 0;
    this.userChat.userImg = this.user.userPic;
  }
  closeGameRequestModal()
  {
    this.isRequestModal = false;
  }
  openRequestModal()
  {
    this.isRequestModal = true;
  }
  closeModal()
  {
    this.closeModalEmitter.emit();
  }
  closeChatModal()
  {
    this.isChatModalOpen = false;
  }
  // handleRequestConfirmation($event)
  // {

  // }
  openChatModal()
  {
    this.isChatModalOpen = true;
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
            this.user.isFriend = false;
       //     this.userStatus = this.notFriend;
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
            this.user.isFriend = true;
            // this.userStatus = this.friend;
            this.cdr.detectChanges(); 
          },
          error: err => console.log(err)
      });
    }
  }
  //to add: request game.
}
