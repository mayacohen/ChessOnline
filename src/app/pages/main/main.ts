import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Board } from '../../components/board/board';
import { CommonModule } from '@angular/common';
import { RequestGameModal } from '../../components/request-game-modal/request-game-modal';
import { Client } from '../../services/client';
import { WebsocketService } from '../../services/websocket-service';
@Component({
  selector: 'app-main',
  imports: [Navbar, Board, CommonModule, RequestGameModal],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main implements OnInit{
  isLoginModalOpen = false;
  isRequestModalOpen = false;
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
      },
      error: err => console.log(err)
    });
    this.isUserLoggedIn = this.client.getLoggedInStatus(); 
    this.ws.getMessages().subscribe({
      next: m => console.log(m),
      error: err => console.log(err)   
    });
  }
  handleGameRequestModal()
  {
    this.isRequestModalOpen = false;
  }
}
