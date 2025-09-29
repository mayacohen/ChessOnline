import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Board } from '../../components/board/board';
import { CommonModule } from '@angular/common';
import { RequestGameModal } from '../../components/request-game-modal/request-game-modal';
import { Client } from '../../services/client';
import { WebsocketService } from '../../services/websocket-service';
import { timeInterval } from 'rxjs';
import { ClientServerMessage } from '../../models/client-server-message';
import { RequestConfirmation } from '../../components/request-confirmation/request-confirmation';
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
  constructor (private client:Client, private ws: WebsocketService,
    private cdr:ChangeDetectorRef){}
  ngOnInit(): void {
    this.client.activate().subscribe({
      next: response =>
      {
        sessionStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken); 
        this.ws.connect(response.accessToken);
        setTimeout(() => this.ws.getMessages().subscribe({
          next: m => 
          {
            console.log(m);
            if ('type' in m && m.type === "Game Request")
              this.handleGameRequest(m);
            //Game response, move, chat?
            if ('type' in m && m.type === "Game Response")//start game
              this.gameResponseHandler(m);
            if ('type' in m && (m.type === "Lose" || m.type === "Draw" || 
              m.type === "Move" || m.type === "Promotion"))
              this.client.newServerGameData.next(m);
          },
          error: err => console.log(err)   
        }), 1000);
      },
      error: err => console.log(err)
    });
    this.isUserLoggedIn = this.client.getLoggedInStatus(); 
  }
  ngOnDestroy(): void {
    this.ws.closeConnection();
  }
  gameResponseHandler(message:ClientServerMessage)
  {
    if (this.isPlaying)
    {
      console.log("error"); 
      return
    }
    this.isPlaying = true;
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
    this.client.setUserName(message.receiverUserName?? "bug");
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
  handleRequestConfirmation(retValue: boolean)
  {
    this.isRequestConfirmation = false;
    if (this.message != null)
    {
      var m !: ClientServerMessage;
      if (retValue && this.isSendingOrGettingRequest)
      {
        m = this.setUpReturnModel(this.message, "accept");
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
          //write message to user about gme failing to load or something
        } 
      });
    }
    else
      console.log("error");
  }
}
