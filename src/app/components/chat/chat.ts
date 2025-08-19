import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageModel } from '../../models/message-model';
import { CommonModule } from '@angular/common';
import { Client } from '../../services/client';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat implements OnInit{
  @Input() usernameCommunicatingWith = 'example.png';
  @Input() imgUserCommunicatingWith = '';
  messages:MessageModel[] =[]; 
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
