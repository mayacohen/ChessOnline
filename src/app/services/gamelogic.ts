import { Injectable } from '@angular/core';

class Position
{
  private row!: number;
  private col!: number;
  constructor(row:number, col:number)
  {
    this.row=row;
    this.col=col;
  }
  getRow()
  {
    return this.row;
  } 
  getCol()
  {
    return this.col;
  }
}
class MovePosition
{
  private oldPos!: Position;
  private newPos!: Position;
  constructor(oldPos: Position, newPos:Position)
  {
    this.oldPos = oldPos;
    this.newPos = newPos;
  }
  getOldRow()
  {
    return this.oldPos.getRow();
  }
  getOldCol()
  {
    return this.oldPos.getCol();
  }
  getNewRow()
  {
    return this.newPos.getRow();
  }
  getNewCol()
  {
    return this.newPos.getCol();
  }
  isSameRowOrCol()
  {
    if (this.getNewCol() === this.getOldCol() || this.getOldRow() === this.getNewRow())
      return true;
    return false;
  }
  getColAbs()
  {
    return Math.abs(this.getNewCol()-this.getOldCol());
  }
  getRowAbs()
  {
    return Math.abs(this.getNewRow()-this.getOldRow());
  }
  getRowMin()
  {
    return Math.min(this.getNewRow(),this.getOldRow());
  }
  getColMin()
  {
    return Math.min(this.getNewCol(),this.getOldCol());
  }
  getOldPos()
  {
    return this.oldPos;
  } 
  getNewPos()
  {
    return this.newPos;
  } 
}
class chessPiece
{
  private isWhite!:boolean;
  constructor(isWhite:boolean)
  {
    this.isWhite = isWhite;
  }
  getString() : string
  {
    if (this.isWhite)
      return 'w';
    return 'b';
  }
  getWhite()
  {
    return this.isWhite;
  }
  public isLegalMovement(positions: MovePosition, isCheckBoard:boolean, game:ChessGame)
  {
    if ((positions.getNewRow() === positions.getOldRow() 
      && positions.getOldCol() === positions.getNewCol()) ||
      (game.getPieceFromBoard(positions.getOldPos(), isCheckBoard) === null) 
      || (game.getPieceFromBoard(positions.getNewPos(), isCheckBoard) !== null 
    && game.getPieceFromBoard(positions.getNewPos(), isCheckBoard)?.isWhite ===
     game.getPieceFromBoard(positions.getNewPos(), isCheckBoard)?.isWhite))
      return false;
    return true;
  }
}
class Rook extends chessPiece
{
  private hasMoved : boolean = false;
  constructor(isWhite: boolean, copyRook?: Rook)
  {
    if (copyRook !== undefined && copyRook !== null)
    {
        super(copyRook.getWhite());
        this.hasMoved = copyRook.getMoved();
    }
    else
        super(isWhite);
  }
  override isLegalMovement(positions: MovePosition, isCheckBoard: boolean, game:ChessGame): boolean {
    if (!positions.isSameRowOrCol() || !super.isLegalMovement(positions, isCheckBoard, game))
      return false;
    let min, max, isRowSame;
    if (positions.getNewCol() === positions.getOldCol())
    {
      min = positions.getRowMin();
      max = Math.max(positions.getNewRow(), positions.getOldRow());
      isRowSame = false;
    }
    else
    {
      min = positions.getColMin();
      max = Math.max(positions.getNewCol(), positions.getOldCol());
      isRowSame = true;
    }
    for (let i = min+1; i < max; i++)
    {
      const rowIndex = isRowSame? positions.getNewRow() : i;
      const colIndex = isRowSame? i : positions.getNewCol();
      if (game.getPieceFromBoard(new Position(rowIndex, colIndex),isCheckBoard) != null)
        return false; 
    }
    return true;
  }
  getMoved()
  {
    return this.hasMoved;
  }
  setMoved()
  {
    this.hasMoved = true;
  }
  override getString()
  {
    return 'R'+super.getString();
  }
}
class Knight extends chessPiece
{
  override getString()
  {
    return 'N'+super.getString();
  }
  constructor(isWhite:boolean, copyKnight?: Knight)
  {
    if (copyKnight !== undefined && copyKnight !== null)
        super(copyKnight.getWhite());
    else
        super(isWhite);
  }
  override isLegalMovement(positions: MovePosition, isCheckBoard: boolean, game: ChessGame): boolean {
    const difC = positions.getColAbs(), difR = positions.getRowAbs();
    if ((difC === 1 && difR === 2) || (difC === 2 && difR === 1))
      return super.isLegalMovement(positions, isCheckBoard, game);
    return false;
  }
}
class Bishop extends chessPiece
{
    override getString()
  {
    return 'B'+super.getString();
  }
  constructor(isWhite:boolean, copyBishop?: Bishop)
  {
    if (copyBishop !== undefined && copyBishop !== null)
        super(copyBishop.getWhite());
    else
        super(isWhite);
  }
  override isLegalMovement(positions: MovePosition, isCheckBoard: boolean, game: ChessGame): boolean {
    const difC = positions.getColAbs(), difR = positions.getRowAbs();
    if ((difC === difR) && (difC !== 0))
    {
      const rowMin = positions.getRowMin(), colMin = positions.getColMin();
      for (let i = 1; i < difC; i++)
      {
        if (game.getPieceFromBoard(new Position(rowMin+i, colMin+i), isCheckBoard) !== null)
          return false;
      }
      return super.isLegalMovement(positions, isCheckBoard, game);
    }
    return false;
  }
}
class Queen extends chessPiece
{
  override getString()
  {
    return 'Q'+super.getString();
  }
  constructor(isWhite:boolean, copyQueen?: Queen)
  {
    if (copyQueen !== undefined && copyQueen !== null)
        super(copyQueen.getWhite());
    else
        super(isWhite);
  }
  override isLegalMovement(positions: MovePosition, isCheckBoard: boolean, game: ChessGame): boolean
  {
    const b: Bishop = new Bishop(super.getWhite()), r = new Rook(super.getWhite());
    if (r.isLegalMovement(positions, isCheckBoard, game) ||
    b.isLegalMovement(positions, isCheckBoard, game))
      return true;
    return false;
  }
}
class Pawn extends chessPiece
{
  private hasMoved = false;
  private isFirstMoveLastTurn = false;
  private diedToEnPassant = false;
  setMoved()
  {
    this.hasMoved = true;
    this.isFirstMoveLastTurn = true;
  }  
  setDiedToEnPassant()
  {
    this.diedToEnPassant = true;
  }
  getDiedToEnPassant()
  {
    return this.diedToEnPassant;
  }
  setHasMovedTurn()
  {
    this.isFirstMoveLastTurn = false;
  }
    override getString()
  {
    return 'P'+super.getString();
  }
  constructor(isWhite:boolean, copyPawn?: Pawn)
  {
    if (copyPawn !== undefined && copyPawn !== null)
    {
        super(copyPawn.getWhite());
        this.diedToEnPassant = copyPawn.diedToEnPassant;
        this.hasMoved = copyPawn.hasMoved;
        this.isFirstMoveLastTurn = copyPawn.isFirstMoveLastTurn;
    }
    else
        super(isWhite);
  }
  override isLegalMovement(positions: MovePosition, isCheckBoard: boolean, game: ChessGame): boolean {
    if (!((super.getWhite() && positions.getNewRow() < positions.getOldRow()) ||
     (!super.getWhite() && positions.getNewRow() > positions.getOldRow())))
     return false;
    const newSq = game.getPieceFromBoard(positions.getNewPos(), isCheckBoard); 
    if ((((positions.getColAbs() === 0 && newSq === null)
    && (positions.getRowAbs() === 1 || (positions.getRowAbs() === 2 && !this.hasMoved))) //not eating   
    || ((positions.getColAbs() === 1 && newSq !== null) && positions.getRowAbs() === 1))) 
      return super.isLegalMovement(positions, isCheckBoard, game);
    const isPiecePawn = game.getPieceFromBoard(new Position(positions.getNewRow(), positions.getOldCol()), isCheckBoard) instanceof Pawn;
    if (positions.getColAbs() === 1 && isPiecePawn && positions.getRowAbs() === 1 && 
    newSq === null)    
    {
      const pawn = game.getPieceFromBoard(new Position(positions.getNewRow(), positions.getOldCol()), isCheckBoard) as Pawn;
      if (pawn.getWhite() !== super.getWhite() && pawn.isFirstMoveLastTurn && ((super.getWhite() && positions.getOldRow() === 3) ||
      (!super.getWhite() && positions.getOldRow() === 4)))
      {
        pawn.diedToEnPassant = true;
        return super.isLegalMovement(positions, isCheckBoard, game);
      }
      return false;
    }
    return false;
  }
}
class King extends chessPiece
{
  private hasMoved = false;
  setMoved()
  {
    this.hasMoved = true;
  }  
  getMoved()
  {
    return this.hasMoved;
  }
  override getString()
  {
    return 'K'+super.getString();
  }
  constructor(isWhite: boolean, copyKing?: King)
  {
    if (copyKing !== undefined && copyKing !== null)
    {
        super(copyKing.getWhite());
        this.hasMoved = copyKing.getMoved();
    }
    else
        super(isWhite);
  }
  override isLegalMovement(positions: MovePosition, isCheckBoard: boolean, game: ChessGame): boolean {
    if (positions.getRowAbs() <= 1 && positions.getRowAbs() <= 1)
      return super.isLegalMovement(positions, isCheckBoard, game);
    if (positions.getRowAbs() === 0 && !this.hasMoved && game.getPieceFromBoard(positions.getNewPos(),isCheckBoard) instanceof Rook)
    {
      const rook =  game.getPieceFromBoard(positions.getNewPos(),isCheckBoard) as Rook;
      if (!rook.getMoved() && rook.getWhite() === super.getWhite())
      {
        //for () king not threatented
        return true;
      }
    }
    return false;
  }
}
class ChessGame
{
  private board!: (chessPiece | null)[][];
  private checkBoard!: (chessPiece | null)[][];
  private isWhiteTurn: boolean = true;
  private isWhitePlayer!: boolean;
  private numOfMovesSincePawnOrEating = 0;

  getPieceFromBoard(pos: Position, isCheckBoard:boolean): (chessPiece | null)
  {
    if (pos.getRow() >= 0 && pos.getRow() < 8 && pos.getCol() >= 0 && pos.getCol() < 8)
    {
      if (!isCheckBoard)
        return this.board[pos.getRow()][pos.getCol()];
      else
        return this.checkBoard[pos.getRow()][pos.getCol()];
    }
    console.log('bug');
    return null;
  }
  getNewElem():chessPiece | null
  {
    return null;
  }
  constructor(isWhitePlayer:boolean)
  {
    this.isWhitePlayer = isWhitePlayer;
    this.checkBoard = [];
    this.board = [];
    for (let i = 0; i< 8; i++)
    {
      if (!this.board[i])
        this.board[i] = [];
      const isWhite = i<3? false : true; 
      for( let j = 0; j< 8; j++)
      {
        let elem!: chessPiece | null;
        if (i >= 2 && i < 6)
          elem = null;
        else if (i==1 || i==6)
          elem = new Pawn(isWhite);
        else if (j==0 || j==7)
          elem = new Rook(isWhite);
        else if (j==1 || j==6)
          elem = new Knight(isWhite);
        else if (j==2 || j==5)
          elem = new Bishop(isWhite);
        else if (j==3)
          elem = new Queen(isWhite);
        else if (j==4)
          elem = new King(isWhite);
        else
        {
          elem = null;
          console.log('bug');
        }
        this.board[i].push(elem);
      }
    }
  }
  setMoveOpposition(movePosition: MovePosition)
  {
    if (this.getPieceFromBoard(movePosition.getOldPos(), false)?.getWhite() === null || 
    this.getPieceFromBoard(movePosition.getOldPos(), false)?.getWhite() === this.isWhitePlayer)
    {
      console.log('bug');
      return;
    }
    if ((this.getPieceFromBoard(movePosition.getOldPos(), false) instanceof King || 
    this.getPieceFromBoard(movePosition.getNewPos(), false) instanceof King) &&
    (this.getPieceFromBoard(movePosition.getOldPos(), false) instanceof Rook || 
    this.getPieceFromBoard(movePosition.getNewPos(), false) instanceof Rook) &&
    this.getPieceFromBoard(movePosition.getOldPos(), false)?.getWhite() ===
     this.getPieceFromBoard(movePosition.getNewPos(), false)?.getWhite()) 
    {
      //not correct, they move in middle - {c,d} | {f,g}
    }   
    //en passant
    //do move
    //promotion
    //save history
  }
  getLegalMoveForPiece() : string[]
  {
    //check if it's a piece of your side and if it's islegal for piece
    //then check if it's threatented
    //if legal then send a message to rival
    //check for win, draw 
    return [''];
  }
}

//class utility to translate string to idc.
@Injectable({
  providedIn: 'root'
})
export class Gamelogic {

}
