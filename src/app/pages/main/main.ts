import { Component, OnInit, OnDestroy } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Board } from '../../components/board/board';
import { CommonModule } from '@angular/common';
import { RequestGameModal } from '../../components/request-game-modal/request-game-modal';
import { Client } from '../../services/client';
import { WebsocketService } from '../../services/websocket-service';
import { timeInterval } from 'rxjs';
import { ClientServerMessage } from '../../models/client-server-message';
@Component({
  selector: 'app-main',
  imports: [Navbar, Board, CommonModule, RequestGameModal],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main implements OnInit, OnDestroy{
  isLoginModalOpen = false;
  isRequestModalOpen = false;
  isRequestConfirmation = false;
  isUserLoggedIn = false;
  isPlaying = false;
  message: ClientServerMessage | null = null;
  constructor (private client:Client, private ws: WebsocketService ){
  }
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
            if (m.type && m.type === "Game Request")
              this.handleGameRequest(m);
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
    if (this.isRequestConfirmation || this.isPlaying)
      {
        const m = this.setUpReturnModel(message, "reject");
        this.client.handleGameRequestResponse(m).subscribe({
          next: x => {},
          error: err => console.log(err) 
        })
        return;
      } //I don't want users to recieve more then one inventation at the same time
    this.message = message;
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
      }
      console.log("Running 2 minutes later:", new Date().toISOString());
    }, finalDelay);
  
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
      if (retValue)
      {
        m = this.setUpReturnModel(this.message, "accept");
        this.isPlaying = true;
      }
      else
        m = this.setUpReturnModel(this.message, "reject");
      this.client.handleGameRequestResponse(m).subscribe({
        next: x => 
          {},
        error: err => {
          this.isPlaying = false;
          //write message to user about gme failing to load or something
        } 
      });
    }
    else
      console.log("error");
  }
}
