import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input,
  ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameTracker } from '../game-tracker/game-tracker';
import { Gamelogic, Utility, Position } from '../../services/gamelogic';
import { Client } from '../../services/client';
import { PlayerDetailsForGame } from '../player-details-for-game/player-details-for-game';
import { ClientServerMessage } from '../../models/client-server-message';
import { GameOver } from '../game-over/game-over';
import { Promotion } from '../promotion/promotion';
import { StringReturn } from '../../models/string-return';
import { format, addMinutes } from 'date-fns' 
import { timeInterval } from 'rxjs';
import { sq } from 'date-fns/locale';
import { ActiveUserModel } from '../../models/active-user-model';
@Component({
  selector: 'app-board',
  imports: [CommonModule, GameTracker, PlayerDetailsForGame, GameOver, Promotion],
  templateUrl: './board.html',
  styleUrl: './board.scss',
  encapsulation: ViewEncapsulation.None
})
export class Board implements OnInit, AfterViewInit{
  @Input() opponentUserName = ''; 
  @Input() gameTimer = 0;
  @Output() closeBoard = new EventEmitter<void>();
  currentGameTime = -1;
  isGameOver = false;
  isGameOverAndMessage = false;
  isPromotionWindowOpen = false;
  promotedSqr : HTMLElement | null = null;
  gameOverType = '';
  lastOppositionMove = '';
  board: string[][] = [];
  whitePlayerDetails : ActiveUserModel = {username: 'Guest', userImg: 'example.png'
       , score: null};
  blackPlayerDetails : ActiveUserModel = {username: 'Guest', userImg: 'example.png'
       , score: null};  
  @Input() isWhitePlayer : boolean = true;
  isWhiteTurn = true; 
  rowIndices = ['A','B','C','D','E','F','G','H'];
  colIndicesReverse = ['1','2','3','4','5','6','7','8'];
  colIndices= this.colIndicesReverse.reverse();
  remainingTime = this.gameTimer;
  currentPickedSquare: string | null = null;
  constructor(private client:Client, private gamelogic:Gamelogic,
    private cdr: ChangeDetectorRef){}
  listOfElemIds: string[] = [];
  ngOnInit(): void {
    //this.player.username = this.client.getUserName();
    //userName, userpic, score
    if (this.opponentUserName === '')
      this.opponentUserName= this.client.gameOpponent;
    this.setPlayerDetails()
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
          this.doMoveHTML(csm.content.substring(0,4));
          if (csm.content.length == 5)
          {
            const parentElem = document.getElementById(csm.content.substring(2,4));
            if (parentElem != null)
              this.doClientSidePromotion(csm.content[4], parentElem);
          }
        }
        if (csm.type !== "default" && csm.type !=="Move")
        {
          this.isWhiteTurn = !this.isWhiteTurn;
          this.setGameOver(csm.type);
        }
        this.cdr.detectChanges();
      },
      error: err => console.log(err) 
  });
  }
  setPlayerDetails()
  {
    const thisPlayer : ActiveUserModel = {
      username : "You: " + this.client.getUserName(),
      userImg : this.client.getUserPic(),
      score : null //missing
    };
    let opponent: ActiveUserModel = {
      username : this.opponentUserName,
      userImg : "example.png", //missing
      score : null //missing
      };
    if (!this.opponentUserName.startsWith('Guest-'))
    {
      this.client.getLoggedUserDetails(this.opponentUserName).subscribe({
        next: user =>
        {
          opponent.score = user.score;
          opponent.userImg = user.userPic; 
          this.setUsersAsGamePlayers(thisPlayer, opponent);
        },
        error : err =>  
          {
            console.log(err);
            this.setUsersAsGamePlayers(thisPlayer, opponent);
          }
      });
    }
    else
      this.setUsersAsGamePlayers(thisPlayer, opponent);
  }
  setUsersAsGamePlayers(thisPlayer:ActiveUserModel, opponent:ActiveUserModel)
  {
    if (this.isWhitePlayer)
    {
      this.whitePlayerDetails = thisPlayer;
      this.blackPlayerDetails = opponent;
    }
    else
    {
      this.blackPlayerDetails = thisPlayer;
      this.whitePlayerDetails = opponent;
    }
    this.cdr.detectChanges();
  } 
  doMoveHTML(ids:string)
  {
    this.client.newTrackingMove.next(ids);
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
        if (pawnRemove.children[0].id.includes('w') === this.isWhitePlayer)
          this.setAsDragTarget(pawnRemove);
        pawnRemove.removeChild(pawnRemove.children[0]);
      }
      if (elem1.children.length > 0 && 
        elem1.children[0].className.includes('king') && colDiff===2)
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
  moveElement(idStart:string, idEnd:string) //ask chatgpt to streamline?
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
    if (this.isWhitePlayer === startSq.children[0].id.includes('w'))
    {
      this.setAsDragTarget(startSq);
      this.removeAsDragTarget(endSq);
    }
    else if (endSq.children.length > 0 && endSq.children[0].id.includes('w') === this.isWhitePlayer)
      this.setAsDragTarget(endSq);
    if (endSq.children.length > 0)
        endSq.removeChild(endSq.children[0]); 
   endSq.appendChild(startSq.children[0]);
  }
  ngAfterViewInit(): void {
    setInterval(() =>
      {
        this.currentGameTime +=1;
        if (this.currentGameTime >= this.gameTimer)
        {
          this.client.withdrawGame(this.returnCSM("Withdraw", "")).subscribe({
            next: () => this.setGameOver("Withdraw"),
            error: err => console.log(err)
          });
        }
      }
    ,60*1000);
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
        if ((i<3 && !this.isWhitePlayer) ||i>=3 && this.isWhitePlayer)
        {
          chessPiece.draggable = true;
          chessPiece.addEventListener('dragstart', (event) => {
            const currParElem = chessPiece.parentElement;
            if (event.dataTransfer !== null && currParElem !== null)
              event.dataTransfer.setData('text/plain', currParElem.id);
          });
        }
        parent.className= this.getTileClass(i,j,false);
        parent?.appendChild(chessPiece);
        chessPiece.id = elemId + parent?.id;
        this.listOfElemIds.push(chessPiece.id); 
      }
    }
    this.setInitialDragTargets();
    this.gamelogic.startNewGame(this.isWhitePlayer);
  }
  setInitialDragTargets()
  {
    const startRow = this.isWhitePlayer? 0 : 2;
    const endRow = this.isWhitePlayer? 6 : 8;
    for (let i = startRow; i< endRow; i++)
    {
      for (let j =0; j< 8; j++)
      {
        const sqr= document.getElementById(String.fromCharCode(('A'.charCodeAt(0)+j))+(8-i).toString());
        if (sqr !== null)
          this.setAsDragTarget(sqr);
      }
    }
  }
  dragOverHandler(event:DragEvent)
  {
    event.preventDefault();
  }
  dropHandler(sqr:HTMLElement, event:DragEvent)
  {
    event.preventDefault();
    if (event.dataTransfer !== null)
    {
        const dragStartId = event.dataTransfer.getData('text/plain');
        this.onSquareClick(dragStartId);
        this.onSquareClick(sqr.id);
    }
  }
  private dragOverListener = (event: DragEvent) => this.dragOverHandler(event);
  private dropListeners = new Map<HTMLElement, (event: DragEvent) => void>();
  setAsDragTarget(sqr: HTMLElement) {
    sqr.addEventListener('dragover', this.dragOverListener);
    const dropListener = (event: DragEvent) => this.dropHandler(sqr, event);
    this.dropListeners.set(sqr, dropListener);
    sqr.addEventListener('drop', dropListener);
  }
  removeAsDragTarget(sqr: HTMLElement) {
    sqr.removeEventListener('dragover', this.dragOverListener);
    const dropListener = this.dropListeners.get(sqr);
    if (dropListener) {
      sqr.removeEventListener('drop', dropListener);
      this.dropListeners.delete(sqr);
    }
  }
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
    this.isPromotionWindowOpen = false;
    this.client.setPromotion(this.returnCSM("Promotion", promotion[0])).subscribe({
      next: () => {
        this.isWhiteTurn = ! this.isWhiteTurn;
        if (this.promotedSqr !== null && this.promotedSqr.children.length > 0)
          this.doClientSidePromotion(promotion, this.promotedSqr);
      }
      , error: err => console.log(err)
    });
  }
  doClientSidePromotion(char: string, parentSqr: HTMLElement)
  {
        const promotedI = parentSqr.children[0];
        switch(char)
        {
          case 'n':
            promotedI.className = promotedI.className.replace('pawn', 'knight');
            break;
          case 'q':
            promotedI.className = promotedI.className.replace('pawn', 'queen');
            break;
          case 'b':
            promotedI.className = promotedI.className.replace('pawn', 'bishop');
            break;
          case 'r':
            promotedI.className = promotedI.className.replace('pawn', 'rook');
            break;  
        }
        this.gamelogic.game.setPromotion(Utility.standardToNum(
          parentSqr.id), char); 
        this.cdr.detectChanges();
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
    this.client.setMove(message).subscribe({next: returnString => {
      this.gamelogic.setMove(this.currentPickedSquare+id);
      this.removeFormerCircles();
      this.setSquareHiglighted(square);
      if (this.gamelogic.game.getIsWaitingForPromotion())
      {
        this.isPromotionWindowOpen = true;
        this.promotedSqr = document.getElementById(id);
      }
      else
        this.isWhiteTurn = ! this.isWhiteTurn;
      this.doMoveHTML(this.currentPickedSquare+id); 
      if (!this.gamelogic.game.getIsWaitingForPromotion())
        this.currentPickedSquare = null;
      if (returnString.retValue === "Win" || returnString.retValue === "Draw")
      {
        this.setGameOver(returnString.retValue);
      }
      if (returnString.retValue === "Retry")
      {
        this.client.retryMove(message).subscribe({
          error: err =>  {
            this.setGameOver("Lost Connectivity");
          }
        });
      }
      this.cdr.detectChanges();   
    },
      error: err => console.log(err)
    });
  }
  setGameOver(message: string)
  {
    this.isWhiteTurn = this.isWhitePlayer;
    this.isGameOver = true;
    this.gameOverType = message;
    this.isGameOverAndMessage = true;
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
  returnToMain()
  {
    this.closeBoard.emit();
  }
}