import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameTracker } from '../game-tracker/game-tracker';
import { Gamelogic } from '../../services/gamelogic';
import { Client } from '../../services/client';
import { PlayerDetailsForGame } from '../player-details-for-game/player-details-for-game';
import { ActiveUserModel } from '../../models/active-user-model';
@Component({
  selector: 'app-board',
  imports: [CommonModule, GameTracker, PlayerDetailsForGame],
  templateUrl: './board.html',
  styleUrl: './board.scss',
  encapsulation: ViewEncapsulation.None
})
export class Board implements OnInit, AfterViewInit{
  board: string[][] = [];
  @Input() opponent: ActiveUserModel = {username: 'Guest', userImg: 'example.png', score: null, id: ''}; 
  player: ActiveUserModel = {username: 'Guest', userImg: 'example.png', score: null, id: ''};
  constructor(private client:Client, private gamelogic:Gamelogic){}
  ngOnInit(): void {
    this.player.username = this.client.getUserName();
    for (let i = 0; i< 8; i++)
    {
      if (!this.board[i])
        this.board[i] = [];
      for (let j = 0; j<8; j++)
        this.board[i].push((8-i).toString()+ String.fromCharCode(('A'.charCodeAt(0)+j)));
    }
  }
  ngAfterViewInit(): void {
    for (let i = 0; i< 8; i++)
    {
      if (i==2)
        i=6;
      for( let j = 0; j< 8; j++)
      {
        let elemId = '';
        const chessPiece = document.createElement("I");
        if (i==1 || i==6)
        {
          elemId+='P';
          chessPiece.className="fa-solid fa-chess-pawn";
        }
        else if (j==0 || j==7)
        {
          chessPiece.className = "fa-solid fa-chess-rook";
          elemId+='R';
        }
        else if (j==1 || j==6)
        {
          chessPiece.className = "fa-solid fa-chess-knight";
          elemId+='N';
        }
        else if (j==2 || j==5)
        {
          chessPiece.className = "fa-solid fa-chess-bishop";
          elemId+='B';
        }
        else if (j==3)
        {
          chessPiece.className = "fa-solid fa-chess-queen";
          elemId+='Q';
        }
        else if (j==4)
        {
          chessPiece.className = "fa-solid fa-chess-king";
          elemId+='K';
        }
        const parent = document.getElementById(this.board[i][j]);
        if (i<3)
        {
          chessPiece.classList.add('blackPiece');
          elemId+='w';
        }
        else
        {
          chessPiece.classList.add('whitePiece');
          elemId+='b';
        }
        parent?.appendChild(chessPiece);
        chessPiece.id = elemId + parent?.id;
      }
    }
  }
}
