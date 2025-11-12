import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Board } from '../../components/board/board';
import { CommonModule } from '@angular/common';
import { RequestGameModal } from '../../components/request-game-modal/request-game-modal';
import { Client } from '../../services/client';
import { WebsocketService } from '../../services/websocket-service';
import { ClientServerMessage } from '../../models/client-server-message';
import { RequestConfirmation } from '../../components/request-confirmation/request-confirmation';
import { RequestConfirmationReturnValue } from '../../models/request-confirmation-return-value';
import { PopupMessageModel } from '../../models/popup-message-model'; 
@Component({
  selector: 'app-main',
  imports: [Navbar, Board, CommonModule, RequestGameModal,
    RequestConfirmation],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main implements OnInit, OnDestroy{
  isLoginModalOpen = false;
  isRequestModalOpen = false;
  isRequestConfirmation = false;
  isUserLoggedIn = false;
  isPlaying = false;
  isSendingOrGettingRequest = false;
  message: ClientServerMessage | null = null;
  isWhitePlayer = true; 
  userGame = "";
  timer = 0; //reset at end of game;
  constructor (private client:Client, private ws: WebsocketService,
    private cdr:ChangeDetectorRef, private router:Router){}
  ngOnInit(): void {
    localStorage.clear();
    this.recoursiveActivate(100);
    this.isUserLoggedIn = this.client.getLoggedInStatus(); 
  }
  handleWebSocketMesseges(m:any)
  {
    console.log(m);
    if ('type' in m && m.type === 'Chat Request')
      this.handleNewMessage(m);
    if ('type' in m && m.type === "Game Request")
      this.handleGameRequest(m);
    //Game response, move, chat?
    if ('type' in m && m.type === "Game Response")//start game
      this.gameResponseHandler(m);
    if ('type' in m && (m.type === "Lose" || m.type === "Draw" || 
      m.type === "Move" || m.type === "Promotion"))
    this.client.newServerGameData.next(m);
  }
  setTokens(response:any)
  {
    sessionStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken); 
     this.ws.connect(response.accessToken);
        setTimeout(() => this.ws.getMessages().subscribe({
          next: m => 
            this.handleWebSocketMesseges(m),
          error: () => {
            this.ws.connect(response.accessToken);
             setTimeout(() => this.ws.getMessages().subscribe({
          next: m => 
            this.handleWebSocketMesseges(m),
          error: () => {
            this.ws.connect(response.accessToken);
             setTimeout(() => this.ws.getMessages().subscribe({
          next: m => 
            this.handleWebSocketMesseges(m),
          error: () => {
            this.router.navigate(['/error']);
          }  
        }), 1000)}})
          , 1000)}}),1000);
  }
  recoursiveActivate(time:number)
  {
    if (time > 1000)
    {
      this.router.navigate(['/error']);
      console.log("Server down");
      return;
    }
    this.client.activate().subscribe({next: response =>
        this.setTokens(response),
      error: () => {
          setTimeout(() => this.recoursiveActivate(time+100),time);
      }});
  }
  ngOnDestroy(): void {
    this.ws.closeConnection();
    localStorage.clear();
  }
  gameResponseHandler(message:ClientServerMessage)
  {
    //if game response = false?
    if (message.content === 'false')
    {
      this.client.rejectedResponseUser.next(message.senderUserName?? '');
      this.isSendingOrGettingRequest = false;
      return;
    }
    if (this.isPlaying)
    {
      console.log("error"); 
      return
    }
    if (message.content !== null)
      this.timer = parseInt(message.content);
    this.isPlaying = true;
    this.isRequestModalOpen = false;
    this.isSendingOrGettingRequest = false;
    this.cdr.detectChanges();
  }
  setUpReturnModel(message: ClientServerMessage, content:string)
  {
    const m : ClientServerMessage =
    {
      content: content,
      senderUserName : message.receiverUserName,
      receiverUserName :  message.senderUserName,
      date : new Date().toISOString(),
      type : "Game Response"
    };
    return m;
  }
  handleGameRequest(message: ClientServerMessage)
  {
    if (this.isRequestConfirmation || this.isPlaying || 
      message.senderUserName == null || this.isSendingOrGettingRequest)
      {
        const m = this.setUpReturnModel(message, "reject");
        this.client.handleGameRequestResponse(m).subscribe({
          next: x => {},
          error: err => console.log(err) 
        })
        return;
      } //I don't want users to recieve more then one inventation at the same time
    this.isSendingOrGettingRequest = true;  
    this.message = message;
    if (message.content !== null)
      this.timer= parseInt(message.content);
    //this.client.setUserName(message.receiverUserName?? "bug");
    this.userGame = message.senderUserName;
    this.client.isGameRequestPopUp.next(true);
    this.isRequestConfirmation = true;
    const tempRequestModal = this.isRequestModalOpen;
    this.isRequestModalOpen = false;
    const isoDate = message.date ??new Date().toISOString();
    const date = new Date(isoDate);
    const twoMinutesLater = new Date(date.getTime() + 2 * 60 * 1000);
    const delay = twoMinutesLater.getTime() - Date.now();
    const finalDelay = Math.max(delay, 0);
    setTimeout(() => {
      if (this.isRequestConfirmation)
      {
        this.isRequestConfirmation = false;
        this.isRequestModalOpen = tempRequestModal;
        console.log("Running 2 minutes later:", new Date().toISOString());
      }
    }, finalDelay);
    this.cdr.detectChanges();
  }
  handleGameRequestModal()
  { 
    this.isRequestModalOpen = false;
  }
  handleRequestConfirmation(retValue: RequestConfirmationReturnValue)
  {
    this.isRequestConfirmation = false;
    if (this.message != null)
    {
      var m !: ClientServerMessage;
      if (retValue.isAccepting && this.isSendingOrGettingRequest)
      {
        m = this.setUpReturnModel(this.message, this.timer.toString());
        this.isPlaying = true;
        this.isWhitePlayer = false;
        this.isSendingOrGettingRequest = false;
        this.cdr.detectChanges();
      }
      else
        m = this.setUpReturnModel(this.message, "reject");
      this.client.handleGameRequestResponse(m).subscribe({
        next: x => 
          {},
        error: err => {
          this.isPlaying = false;
          this.cdr.detectChanges();
          //write message to user about game failing to load or something
        } 
      });
    }
    else
      console.log("error");
  }
  handleNewMessage(m: PopupMessageModel)
  {
    this.client.newMessage.next(m);
  }
  gameOver()
  {
    this.isPlaying = false;
    this.isSendingOrGettingRequest = false;
    this.userGame == "";
    this.timer = 0;
    this.message = null;
  }
}
