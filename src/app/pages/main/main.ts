import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Board } from '../../components/board/board';
import { CommonModule } from '@angular/common';
import { RequestGameModal } from '../../components/request-game-modal/request-game-modal';
import { Client } from '../../services/client';
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
  constructor (private client:Client){}
  ngOnInit(): void {
    this.isUserLoggedIn = this.client.getLoggedInStatus(); 
  }
  handleGameRequestModal()
  {
    this.isRequestModalOpen = false;
  }
}
