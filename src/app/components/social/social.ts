import { Component, EventEmitter, Output, OnInit, 
  ChangeDetectorRef} from '@angular/core';
import { Chat } from '../chat/chat';
import { CommonModule } from '@angular/common';
import { ReturnLoggedUsersModel } from '../../models/return-logged-users-model';
import { LoggedInUserModel } from '../../models/logged-in-user-model';
import { Client } from '../../services/client';
@Component({
  selector: 'app-social',
  imports: [Chat, CommonModule],
  templateUrl: './social.html',
  styleUrl: './social.scss'
})
export class Social implements OnInit{
  isChatModalOpen = false;
  @Output() closeSocial = new EventEmitter<void>();
  loggedUsers: ReturnLoggedUsersModel[] | null = [];
  greenClass = 'green-class';
  redClass = 'red-class'
  userChat: LoggedInUserModel = {username : '', 
    userImg: 'example.png', id:'', score:0};
  emptyMessage = "Loading Users..";
  setContent(res:any)
  {
    this.loggedUsers = res;
    this.emptyMessage = "Invite your friends to join!";
    this.cdr.detectChanges();
  }
  constructor(private client:Client, private cdr: ChangeDetectorRef){}
  ngOnInit(): void {
    this.client.getLoggedUsersForChat().subscribe({
      next: res => 
          this.setContent(res),
        error: () => {
          setTimeout(()=>{
            this.client.getLoggedUsersForChat().subscribe({
              next: res => this.setContent(res),
              error:() => {
                this.emptyMessage = "Loading is taking some time.";
                setTimeout(()=>{
                  this.client.getLoggedUsersForChat().subscribe({
                    next: res => this.setContent(res),
                    error:() => {this.emptyMessage = "Invite your friends to join!";
                                this.cdr.detectChanges();
                    }
                  })},2000)} 
            })},100);
  }})}
  closeChatModal()
  {
    this.isChatModalOpen = false;
  }
  unexpectedEventsHandler(event:Event)
  {
    event.stopPropagation();
    event.preventDefault();
  }
  openChat(user:ReturnLoggedUsersModel)
  {
    this.userChat.username = user.userName, 
    this.userChat.userImg = 'example.png',
    this.userChat.score = user.score === null ? 0 : user.score 
    this.isChatModalOpen = true;
  }
  closeSocialModal()
  {
    this.closeSocial.emit();
  }
}
