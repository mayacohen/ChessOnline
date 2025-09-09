import { Component, OnInit, OnDestroy } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Board } from '../../components/board/board';
import { CommonModule } from '@angular/common';
import { RequestGameModal } from '../../components/request-game-modal/request-game-modal';
import { Client } from '../../services/client';
import { WebsocketService } from '../../services/websocket-service';
import { timeInterval } from 'rxjs';
import { GameRequestMessageModel } from '../../models/game-request-message-model';
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
  handleGameRequest(m: GameRequestMessageModel)
  {
    //pop accept game request message (the same modal, just do different message)
    if (this.isRequestConfirmation === true)
      return; //I don't want users to recieve more then one inventation at the same time
    this.client.isGameRequestPopUp.next(true);
    this.isRequestConfirmation = true;
    const tempRequestModal = this.isRequestModalOpen;
    this.isRequestModalOpen = false;
    const isoDate = m.date;
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
    if (retValue)
    {
      this.isPlaying = true;
      //client -> send message to start game
    }
    else
    {
      //client -> send message to other user about rejection
    }
  }
}
