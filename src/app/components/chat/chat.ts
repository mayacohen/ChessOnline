import { Component, Input, OnInit, Output, EventEmitter,
  ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../services/client';
import { FormsModule } from '@angular/forms';
import { LoggedInUserModel } from '../../models/logged-in-user-model';
import { ClientMessageModel } from '../../models/client-message-model';
import { WebsocketService } from '../../services/websocket-service';
import { PopupMessageModel } from '../../models/popup-message-model';
import { timeout } from 'rxjs';
@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat implements OnInit{
  @ViewChild("modal") modalElement!: ElementRef;
  @ViewChild("closeButton") closeButton!: ElementRef;
  @Input() userChat: LoggedInUserModel = {username : '', 
    userImg: 'example.png', id:'', score:0}; 
  messages:ClientMessageModel[] =[]; //do websocket implemantation
  userName:string = '';
  newMessageContent = '';
  @Output() closeChatModal = new EventEmitter<void>();
  constructor(private client:Client, private cdr: ChangeDetectorRef, 
    private websocketService: WebsocketService){}
  ngOnInit(): void {
    this.userName = this.client.getUserName();
    this.client.getConversationWithPartner(this.userChat.username).subscribe({
      next: res => {
        this.messages = res.messages;
        this.cdr.detectChanges();
      },
      error: err => console.log(err) //no matter 
    });
    this.client.newMessage.subscribe({ 
      //also on main - main send here.also open ig. anyway handle
      next: m => 
        {
          console.log(m)
          if (m.sender == this.userChat.username)
          {
            const message : ClientMessageModel ={
              content : m.content,
              receiverUserName : m.receiver,
              date : m.date
            }  
            this.messages.push(message);
            this.cdr.detectChanges();
          }
        },
      error: err => console.log(err)
    });
  }
  closeModal(event:Event)
  {
    if (event.target === this.modalElement.nativeElement || 
      event.target === this.closeButton.nativeElement)
      this.closeChatModal.emit();
  }
  unexpectedEventsHandler(event:Event)
  {
    event.stopPropagation();
    event.preventDefault();
  }
  sendMessage()
  {
    if (this.newMessageContent != '')
    {
      const message: ClientMessageModel = {
        content : this.newMessageContent,
        receiverUserName : this.userChat.username, 
        date :  null
      }; 
      this.client.sendMessageToUser(message).subscribe({
        next: (() =>{
          message.date = new Date().toISOString();
          this.messages.push(message);
          this.newMessageContent = "";
          this.cdr.detectChanges();
        }),
        error: err => {console.log(err);
          setTimeout(() => {
              this.client.sendMessageToUser(message).subscribe({
                next: (() =>{
                  message.date = new Date().toISOString();
                  this.messages.push(message);
                  this.newMessageContent = "";
                  this.cdr.detectChanges();
                }),
                error: err => console.log(err)
              });
          }, 500);
        }
      });
    }
  }
}
