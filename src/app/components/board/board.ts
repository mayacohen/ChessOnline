import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input,
  ChangeDetectorRef
 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameTracker } from '../game-tracker/game-tracker';
import { Gamelogic, Utility, Position } from '../../services/gamelogic';
import { Client } from '../../services/client';
import { PlayerDetailsForGame } from '../player-details-for-game/player-details-for-game';
import { ClientServerMessage } from '../../models/client-server-message';
import { GameOver } from '../game-over/game-over';
import { Promotion } from '../promotion/promotion';
@Component({
  selector: 'app-board',
  imports: [CommonModule, GameTracker, PlayerDetailsForGame, GameOver, Promotion],
  templateUrl: './board.html',
  styleUrl: './board.scss',
  encapsulation: ViewEncapsulation.None
})
export class Board implements OnInit, AfterViewInit{
  @Input() opponentUserName = ''; 
  isGameOver = false;
  isGameOverAndMessage = false;
  isPromotionWindowOpen = false;
  gameOverType = '';
  lastOppositionMove = '';
  board: string[][] = [];
  @Input() isWhitePlayer : boolean = true;
  isWhiteTurn = true; 
  currentPickedSquare: string | null = null;
  constructor(private client:Client, private gamelogic:Gamelogic,
    private cdr: ChangeDetectorRef){}
  listOfElemIds: string[] = [];
  ngOnInit(): void {
    //this.player.username = this.client.getUserName();
    //userName, userpic, score
    if (this.opponentUserName === '')
      this.opponentUserName= this.client.gameOpponent;
    for (let i = 0; i< 8; i++)
    {
      if (!this.board[i])
        this.board[i] = [];
      for (let j = 0; j<8; j++)
        this.board[i].push(String.fromCharCode(('A'.charCodeAt(0)+j))+(8-i).toString());
    }
    this.client.newServerGameData.subscribe({next:
      csm =>
      {
        if (csm.type !== "default")
          this.isWhiteTurn = !this.isWhiteTurn;
        if (csm.content !== null && csm.content.length >= 4)
        {
          this.lastOppositionMove = csm.content;
          this.clearHighLightBoard();
          this.setMoveHighLighted(this.lastOppositionMove);
          if (this.gamelogic.game === undefined)
            console.log('bug');
          this.gamelogic.game.setMoveOpposition(Utility.stringToMovePos(csm.content.substring(0,4)));
          if (csm.content.length == 5)
            this.gamelogic.game.setPromotion(Utility.standardToNum(csm.content.substring(0,2))
          ,csm.content[4]);
          this.doMoveHTML(csm.content);
        }
        if (csm.type !== "default" && csm.type !=="Move")
        {
          this.isGameOver = true;
          this.gameOverType = csm.type;
          this.isGameOverAndMessage = true;
        }
        this.cdr.detectChanges();
      },
      error: err => console.log(err) 
  });
  }
  doMoveHTML(ids:string)
  {
    const elem1 = document.getElementById(ids.substring(0,2));
    const elem2 = document.getElementById(ids.substring(2,4));
    if (elem1 != null && elem2 != null)
    {
      const colDiff = Math.abs(ids.charCodeAt(0)-ids.charCodeAt(2));
      const diff = colDiff+Math.abs(ids.charCodeAt(1)-ids.charCodeAt(3));
      if (elem1.children.length > 0 && 
        elem1.children[0].className.includes('pawn') && 
        diff === 2 && colDiff === 1 && elem2.children.length === 0)
      {
        const pawnRemove = document.getElementById(ids[2]+ids[1]);
        if (pawnRemove === null || pawnRemove.children.length < 1)
        {
          console.log('bug');
          return;
        }
        pawnRemove.removeChild(pawnRemove.children[0]);
      }
      if (elem1.className.includes('king') && colDiff===2)
      {
        let rookStartCol = 'A', rookEndCol='D';
        if (ids.charCodeAt(2) > ids.charCodeAt(0))
        {
          rookStartCol = 'H';
          rookEndCol = 'F';
        }
        this.moveElement(rookStartCol+ids[1],rookEndCol+ids[1]);
      }
      this.moveElement(ids.substring(0,2), ids.substring(2,4));
    }
  }
  moveElement(idStart:string, idEnd:string)
  {
    const startSq = document.getElementById(idStart);
    const endSq = document.getElementById(idEnd);
    if (endSq === null ||
      startSq === null ||startSq.children.length < 1
    ) 
    {
      console.log('bug');
      return;
    }
    if (endSq.children.length > 0)
        endSq.removeChild(endSq.children[0]); 
   endSq.appendChild(startSq.children[0]);
  }
  ngAfterViewInit(): void {
    for (let i = 0; i< 8; i++)
    {
      if (i>= 2 && i<6)
      {
        for( let j = 0; j< 8; j++)
          {
            const tile = document.getElementById(this.board[i][j]);
            if (tile === null) return;
            tile.className= this.getTileClass(i,j,false);
          }
        continue;   
      }
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
        if (parent === null)
          return;
        if (i<3)
        {
          chessPiece.classList.add('blackPiece');
          elemId+='b';
        }
        else
        {
          chessPiece.classList.add('whitePiece');
          elemId+='w';
        }
        parent.className= this.getTileClass(i,j,false);
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
  clearHighLightBoard()
  {
    for (let i = 0; i< 8; i++)
    {
      for (let j=0; j< 8; j++)
      {
         //this.isBoardPieceHighLighted[i][j]=false;
         const elem = document.getElementById(this.board[i][j]);
         if (elem != null)
          elem.className = this.getTileClass(i,j,false);
      }
    }
  }
  closeGameOverMessage()
  {
    this.isGameOverAndMessage = false;
    //also freeze the game
  }
  getChosenPromotion(promotion: string)
  {
    this.client.setPromotion(this.returnCSM("Promotion", promotion[0])).subscribe({
      next: () => {
        this.isWhiteTurn = ! this.isWhiteTurn;}
        //turn over process
      , error: err => console.log(err)
    });
  }
  onSquareClick(id:string)
  {
    const square = document.getElementById(id);
    if (square === null || this.isGameOver)
      return;
    if (square.childElementCount !== 0 && (this.isWhitePlayer
    ===  this.isWhiteTurn) && (square.children[0].id.includes('w') === this.isWhiteTurn ||
    square.children[square.childElementCount-1].className.includes('fa-circle')))
    { 
      if (square.children.length === 2 ||
        square.children[0].className.includes("fa-circle"))
        this.doMove(square);
      else if (square.children[0].className.includes("fa-chess"))
        this.onChessPieceClick(square.children[0].id);
    }
  }
  returnCSM(type:string, content: string): ClientServerMessage
  {
     return {
      receiverUserName : this.client.gameOpponent,
      content: content,
      senderUserName : this.client.getUserName(),
      date : null,
      type : type,
    };
  }
  doMove(square:HTMLElement)
  {
    if (this.currentPickedSquare === null)
    {
      console.log("error");
      return;
    }
    const id = square.id;
    const message = this.returnCSM("Move", this.currentPickedSquare+id);
    this.client.setMove(message).subscribe({next: ()=> {
      this.gamelogic.setMove(this.currentPickedSquare+id);
      this.removeFormerCircles();
      this.setSquareHiglighted(square);
      if (this.gamelogic.game.getIsWaitingForPromotion())
        this.isPromotionWindowOpen = true;
      else
        this.isWhiteTurn = ! this.isWhiteTurn;
      this.doMoveHTML(this.currentPickedSquare+id); 
      if (!this.gamelogic.game.getIsWaitingForPromotion())
        this.currentPickedSquare = null;
      this.cdr.detectChanges();
    },
      error: err => console.log(err)
    });
  }
  setMoveHighLighted(ids:string)
  {
    const elem1 = document.getElementById(ids.substring(0,2));
    const elem2 = document.getElementById(ids.substring(2,4));
    if (elem1 != null && elem2 != null)
    {
      this.setSquareHiglighted(elem1);
      this.setSquareHiglighted(elem2);
    }
  }
  setSquareHiglighted(square: HTMLElement)
  {
      const pos:Position = Utility.standardToNum(square.id);
      square.className = this.getTileClass(pos.getRow(), pos.getCol(), true);
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
        const potential = document.getElementById(move.substring(2,4));
        if (potential !== null)
        {
          const circle = document.createElement("I");
          circle.className= "fa-regular fa-circle";
          if (potential.childElementCount!==0)
            circle.style.fontSize = "35px";
          else
            circle.style.fontSize = "10px";
          potential.appendChild(circle);
        }
      });
    }
  }
  removeFormerCircles()
  {
    const prevCircles = document.getElementsByClassName("fa-circle");
    while (prevCircles.length !== 0)
      prevCircles[0].remove();
  }
  getTileClass(i: number, j: number, isHighLighted:boolean):string
  {
    if (isHighLighted)
      return (i + j) % 2 === 0 ? 'tile whiteHighLighted' : 'tile blackHighLighted';
    return (i + j) % 2 === 0 ? 'tile whiteTile' : 'tile blackTile';  
  } 
  markPieceAsClicked(posString: string)
  {
    const newPos = Utility.standardToNum(posString);
    const elemToHighLight = document.getElementById(posString);
      //this.isBoardPieceHighLighted[oldPos.getRow()][oldPos.getCol()] = true; 
      if (this.currentPickedSquare !== null)
      {
          const prevElem = document.getElementById(this.currentPickedSquare);
          this.removeFormerCircles();
          if (prevElem !== null)
          {
            const prevPos = Utility.standardToNum(prevElem.id);
            prevElem.className = this.getTileClass(prevPos.getRow(), prevPos.getCol(),false);
          }
      }
      this.currentPickedSquare = posString;
      if (elemToHighLight !== null)
        elemToHighLight.className = this.getTileClass(newPos.getRow(), newPos.getCol(),true);
      this.cdr.detectChanges();
  }
  //clickOn
}