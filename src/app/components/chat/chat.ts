import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageModel } from '../../models/message-model';
import { CommonModule } from '@angular/common';
import { Client } from '../../services/client';
import { FormsModule } from '@angular/forms';
import { LoggedInUserModel } from '../../models/logged-in-user-model';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat implements OnInit{
  @Input() userChat: LoggedInUserModel = {username : '', 
    userImg: 'example.png', id:'', score:0}; 
  messages:MessageModel[] =[]; //do websocket implemantation
  userName:string = '';
  newMessageContent = '';
  @Output() closeChatModal = new EventEmitter<void>();
  constructor(private client:Client){}
  ngOnInit(): void {
    this.userName = this.client.getUserName();
    //same for img
  }
  //subscribe to messages between username && username
  closeModal()
  {
    this.closeChatModal.emit();
  }
  unexpectedEventsHandler(event:Event)
  {
    event.stopPropagation();
    event.preventDefault();
  }
}
