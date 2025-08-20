import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Chat } from '../chat/chat';
import { LoggedInUserModel } from '../../models/logged-in-user-model';
import { CommonModule } from '@angular/common';
import { ActiveUserModel } from '../../models/active-user-model';
@Component({
  selector: 'app-social',
  imports: [Chat, CommonModule],
  templateUrl: './social.html',
  styleUrl: './social.scss'
})
export class Social implements OnInit{
  isChatModalOpen = false;
  @Output() closeSocial = new EventEmitter<void>();
  loggedUsers: LoggedInUserModel[] = [];
  activeUsers: ActiveUserModel[] = []; 
  greenClass = 'green-class';
  redClass = 'red-class'
  userChat: LoggedInUserModel = {username : '', 
    userImg: 'example.png', id:'', score:0};  
  ngOnInit(): void {
    //get users - logged and active, set logged users as active or inactive
  }
  closeChatModal()
  {
    this.isChatModalOpen = false;
  }
  isUserActive(user:LoggedInUserModel)
  {
    if (this.activeUsers.find(u => u.username == user.username) !== undefined)
      return true;
    return false;
  }
  unexpectedEventsHandler(event:Event)
  {
    event.stopPropagation();
    event.preventDefault();
  }
  openChat(user:LoggedInUserModel)
  {
    this.userChat = user;
    this.isChatModalOpen = true;
  }
  closeSocialModal()
  {
    this.closeSocial.emit();
  }
}
