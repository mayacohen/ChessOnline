import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameTracker } from '../game-tracker/game-tracker';
import { Gamelogic, Utility, Position,MovePosition } from '../../services/gamelogic';
import { Client } from '../../services/client';
import { PlayerDetailsForGame } from '../player-details-for-game/player-details-for-game';
import { ClientServerMessage } from '../../models/client-server-message';
@Component({
  selector: 'app-board',
  imports: [CommonModule, GameTracker, PlayerDetailsForGame],
  templateUrl: './board.html',
  styleUrl: './board.scss',
  encapsulation: ViewEncapsulation.None
})
export class Board implements OnInit, AfterViewInit{
  @Input() opponentUserName = ''; 
  board: string[][] = [];
  isBoardPieceHighLighted : boolean[][] = [];
  currentlyClicked: number[] = [-1,-1];
  @Input() isWhitePlayer : boolean = true;
  isWhiteTurn = true; 
  currentPickedSquare: string | null = null;
  constructor(private client:Client, private gamelogic:Gamelogic,
    private position:Position, private movePosition:MovePosition){}
  listOfElemIds: string[] = [];
  ngOnInit(): void {
    //this.player.username = this.client.getUserName();
    for (let i = 0; i< 8; i++)
    {
      if (!this.board[i])
        this.board[i] = [];
      if (!this.isBoardPieceHighLighted[i])
        this.isBoardPieceHighLighted[i] = [];
      for (let j = 0; j<8; j++)
      {
        this.board[i].push((8-i).toString()+ String.fromCharCode(('A'.charCodeAt(0)+j)));
        this.isBoardPieceHighLighted[i].push(false);
      }
        
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
        this.listOfElemIds.push(chessPiece.id); 
      }
    }
    this.gamelogic.startNewGame(this.isWhitePlayer);
  }
  //click on circled place() (or on circle)
  //future - drag and drop.
  //if (not your turn) - add hourglass
  onSquareClick(id:string)
  {
    const Square = document.getElementById(id);
    if (Square === null)
      return;
    if (Square.childElementCount !== 0)
    {
      
      if (Square.children[0].className.includes("fa-chess"))
        this.onChessPieceClick(Square.children[0].id);
    }

  }
  onChessPieceMovment(Square:HTMLElement) //not completed
  {
    if (Square.children[0].className.includes("fa-circle"))
    {
      if (this.currentPickedSquare === null)
      {
        console.log("error");
        return;
      }
      const id = Square.id;
      const message: ClientServerMessage ={
        receiverUserName : this.opponentUserName,
        content: this.currentPickedSquare+id,
        senderUserName : null,
        date : null,
        type : "Move",
      };
      this.client.setMove(message).subscribe({next: ()=> this.gamelogic.setMove(this.currentPickedSquare+id),
        error: err => console.log(err)
      });
    }
  }
  onChessPieceClick(id:string)
  {
    const piece = document.getElementById(id);
    const pos = piece?.parentElement?.id;
    if (id.includes('w') === this.isWhiteTurn && this.isWhitePlayer
    ===  this.isWhiteTurn && pos !== undefined)
    {
      this.markPieceAsClicked(pos);
      const legalMoves = this.gamelogic.getMovesForPiece(pos);
      this.removeFormerCircles();
      legalMoves?.forEach(move => {
        const potential = document.getElementById(move.substring(2,2));
        if (potential !== null)
        {
          const circle = document.createElement("I");
          circle.className= "fa-regular fa-circle";
          if (potential.childElementCount!==0)
            circle.style.fontSize = "35px";
          else
            circle.style.fontSize = "7px";
        }
      });
    }
  }
  removeFormerCircles()
  {
    const prevCircles = document.getElementsByClassName("fa-circle");
    for (let i = 0; i < prevCircles.length; i++)
      prevCircles[i].remove();
  }
  getTileClass(i: number, j: number):string
  {
    if (this.isBoardPieceHighLighted[i][j])
      return (i + j) % 2 === 0 ? 'tile whiteHighLighted' : 'tile blackHighLighted';
    return (i + j) % 2 === 0 ? 'tile whiteTile' : 'tile blackTile';  
  } 
  markPieceAsClicked(posString: string)
  {
    const oldPos = Utility.standardToNum(posString);
      this.isBoardPieceHighLighted[oldPos.getRow()][oldPos.getRow()] = true;
      if (this.currentlyClicked[0] !== -1)
        this.isBoardPieceHighLighted[this.currentlyClicked[0]]
      [this.currentlyClicked[1]] = false;
      this.currentlyClicked[0] = oldPos.getRow();
      this.currentlyClicked[1] = oldPos.getCol();
  }
}