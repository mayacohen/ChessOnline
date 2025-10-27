import { Injectable } from '@angular/core';

export class Position
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
  isLegalPosition()
  {
    if (this.row >= 0 && this.row < 8 && this.col >= 0 && this.col < 8)
      return true;
    return false;
  }
  moveRow(change:number)
  {
    this.row+=change;
  }
  moveCol(change:number)
  {
    this.col+=change;
  }
}
class MovePosition
{
  private oldPos!: Position;
  private newPos!: Position;
  constructor(oldPos: Position, newPos:Position)
  {
    this.oldPos = new Position(oldPos.getRow(), oldPos.getCol());
    this.newPos = new Position(newPos.getRow(), newPos.getCol());
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
  getRowMax()
  {
    return Math.max(this.getNewRow(),this.getOldRow());
  }
  getColMax()
  {
    return Math.max(this.getNewCol(),this.getOldCol());
  }
}
abstract class ChessPiece
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
     game.getPieceFromBoard(positions.getOldPos(), isCheckBoard)?.isWhite))
      return false;
    return true;
  }
  checkDirection(
  rowDelta : number,
  colDelta : number,
  currentPos: Position,
  startPosition: Position,
  isCheckBoard: boolean,
  game: ChessGame, 
  isOneStep: boolean
  ): MovePosition[]
  { 
    let moveResults: MovePosition[] = [];
    currentPos.moveRow(rowDelta);
    currentPos.moveCol(colDelta);
    while (currentPos.isLegalPosition()) {
      const moveToPiece = game.getPieceFromBoard(currentPos, isCheckBoard);
      if (moveToPiece instanceof ChessPiece) {
        if (moveToPiece.getWhite() === this.getWhite()) break;
        moveResults.push(new MovePosition(startPosition, new Position(currentPos.getRow(), currentPos.getCol())));
        break;
      }
      moveResults.push(new MovePosition(startPosition, new Position(currentPos.getRow(), currentPos.getCol())));
      if (isOneStep)
        break;
      currentPos.moveRow(rowDelta);
      currentPos.moveCol(colDelta);
    }
    if (moveResults.length === 0)
      return [];
    return ChessPiece.prototype.returnLegalMoves.call(this, isCheckBoard, game, startPosition, moveResults);
  }
  public returnLegalMoves(isCheckBoard:boolean, game:ChessGame, startPosition?:Position, moves?:MovePosition[], ) : MovePosition[]
  {
    if (moves === undefined)
      return [];
    return moves.filter(m =>
      ChessPiece.prototype.isLegalMovement(m, isCheckBoard, game)
    );
  }
  abstract copy(): ChessPiece;
}
class Rook extends ChessPiece
{
  private hasMoved : boolean = false;
  constructor(isWhite: boolean)
  {
    super(isWhite);
  }
  override returnLegalMoves(isCheckBoard:boolean, game:ChessGame, startPosition?:Position, moves?:MovePosition[], ) : MovePosition[]
  {
    if (!(startPosition instanceof Position))
      return [];
    let moveResults: MovePosition[] = []; 
    let currentPos!: Position;
    const directions: [number, number][] = [ [-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [rowDelta, colDelta] of directions) 
    {
      currentPos = new Position(startPosition.getRow(), startPosition.getCol());
      moveResults.push(...super.checkDirection(rowDelta,colDelta, currentPos, startPosition, isCheckBoard, game, false)); 
    }
    return moveResults;
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
  override copy(): ChessPiece {
    let rook = new Rook(this.getWhite());
    rook.hasMoved = this.hasMoved;
    return rook;
  }
}
class Knight extends ChessPiece
{
  override getString()
  {
    return 'N'+super.getString();
  }
  constructor(isWhite:boolean, copyKnight?: Knight)
  {
    super(isWhite);
  }
  override copy(): ChessPiece {
    return new Knight(this.getWhite());
  }
  override returnLegalMoves(isCheckBoard: boolean, game: ChessGame, startPosition?: Position, moves?: MovePosition[]): MovePosition[]
  {
   if (!(startPosition instanceof Position))
      return [];
    let moveResults: MovePosition[] = []; 
    let currentPos!: Position;
    const deltas: [number, number][] = [];
    const steps = [-2, -1, 1, 2];
    for (const dx of steps) {
      for (const dy of steps) {
        if (Math.abs(dx) !== Math.abs(dy)) {
          deltas.push([dx, dy]);
        }
      }
    }
    for (const [rowDelta, colDelta] of deltas) 
    {
      currentPos = new Position(startPosition.getRow(), startPosition.getCol());
      moveResults.push(...super.checkDirection(rowDelta,colDelta, currentPos, 
        startPosition, isCheckBoard, game, true));  
    }
    return moveResults;
  }
  override isLegalMovement(positions: MovePosition, isCheckBoard: boolean, game: ChessGame): boolean {
    const difC = positions.getColAbs(), difR = positions.getRowAbs();
    if ((difC === 1 && difR === 2) || (difC === 2 && difR === 1))
      return super.isLegalMovement(positions, isCheckBoard, game);
    return false;
  }
}
class Bishop extends ChessPiece
{
    override getString()
  {
    return 'B'+super.getString();
  }
  constructor(isWhite:boolean)
  {
    super(isWhite);
  }
  override copy(): ChessPiece {
    return new Bishop(this.getWhite());
  }
  override returnLegalMoves(isCheckBoard:boolean, game:ChessGame, startPosition?:Position, moves?:MovePosition[], ) : MovePosition[]
  {
    if (!(startPosition instanceof Position))
      return [];
    let moveResults: MovePosition[] = []; 
    let currentPos!: Position;
    const directions: [number, number][] = [ [-1, -1], [1, 1], [1, -1], [-1, 1]];
    for (const [rowDelta, colDelta] of directions) 
    {
      currentPos = new Position(startPosition.getRow(), startPosition.getCol());
      moveResults.push(...super.checkDirection(rowDelta,colDelta, 
        currentPos, startPosition, isCheckBoard, game, false));
    }
    return moveResults;
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
class Queen extends ChessPiece
{
  override getString()
  {
    return 'Q'+super.getString();
  }
  constructor(isWhite:boolean)
  {
    super(isWhite);
  }
  override copy(): ChessPiece {
    return new Queen(this.getWhite());
  }
  override returnLegalMoves(isCheckBoard:boolean, game:ChessGame, startPosition?:Position, moves?:MovePosition[]) : MovePosition[]
  {
    const b: Bishop = new Bishop(super.getWhite()), r = new Rook(super.getWhite());
    let returnVal :MovePosition[]  =  b.returnLegalMoves(isCheckBoard, game,startPosition,moves);
    returnVal.push(...r.returnLegalMoves(isCheckBoard, game,startPosition,moves));
    return returnVal;
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
class Pawn extends ChessPiece
{
  private hasMoved = false;
  private isFirstMoveLastTurn = false;
  setMoved()
  {
    this.hasMoved = true;
    this.isFirstMoveLastTurn = true;
  }  
  setHasMovedTurn()
  {
    this.isFirstMoveLastTurn = false;
  }
  override getString()
  {
    return 'P'+super.getString();
  }
  returnEnPassant(isCheckBoard:boolean, game:ChessGame, startPosition:Position) : MovePosition[]
  {
    let moveResult : MovePosition[] = [];
    if ((!this.getWhite() && startPosition?.getRow() === 4) || 
    (this.getWhite() && startPosition?.getRow() === 3))
    {
      const moveDirection = super.getWhite() ? -1 : 1;
      const pawnsToEat = [ new Position(startPosition.getRow(), startPosition.getCol()+1),
      new Position(startPosition.getRow(), startPosition.getCol()-1)];
      pawnsToEat.forEach(pos =>
      {
        if (pos.isLegalPosition())
        {
          const toEat = game.getPieceFromBoard(pos,isCheckBoard);
          const posPotential = game.getPieceFromBoard(
          new Position(startPosition.getRow()+moveDirection, 
          pos.getCol()), isCheckBoard);
          if (posPotential === null && toEat instanceof Pawn 
            && toEat.getWhite() !== this.getWhite() && 
            toEat.isFirstMoveLastTurn)
            moveResult.push(new MovePosition(startPosition, 
              new Position(startPosition.getRow()+moveDirection, 
          pos.getCol())));
        }
      });
    }
    return moveResult;
  }
  override returnLegalMoves(isCheckBoard:boolean, game:ChessGame, startPosition?:Position, moves?:MovePosition[]) : MovePosition[]
  {
    if (!(startPosition instanceof Position))
      return [];
    const moveDirection = super.getWhite() ? -1 : 1; // white = 7, black = 0
    let moveResult : MovePosition[] = [];
    let checkPos = new Position(startPosition.getRow(), startPosition.getCol());
    checkPos.moveRow(moveDirection);
    if (checkPos.isLegalPosition() && game.getPieceFromBoard(checkPos,isCheckBoard) === null)
    {
      moveResult.push(new MovePosition(startPosition, checkPos));
      checkPos.moveRow(moveDirection);
      if (checkPos.isLegalPosition() && game.getPieceFromBoard(checkPos,isCheckBoard) === null 
        && !this.hasMoved)
        moveResult.push(new MovePosition(startPosition, checkPos));
    }
    checkPos = new Position(startPosition.getRow()+moveDirection, startPosition.getCol()+1);
    if (checkPos.isLegalPosition() && game.getPieceFromBoard(checkPos, isCheckBoard) != null)
      moveResult.push(new MovePosition(startPosition, checkPos));
    checkPos = new Position(startPosition.getRow()+moveDirection, startPosition.getCol()-1);
    if (checkPos.isLegalPosition() && game.getPieceFromBoard(checkPos, isCheckBoard) != null)
      moveResult.push(new MovePosition(startPosition, checkPos));
    moveResult.push(...this.returnEnPassant(isCheckBoard,game,startPosition));
    return super.returnLegalMoves(isCheckBoard, game, startPosition, moveResult);
  } 
  constructor(isWhite:boolean)
  {
    super(isWhite);
  }
  override copy():ChessPiece
  {
    let pawn = new Pawn(this.getWhite());
    pawn.hasMoved = this.hasMoved;
    pawn.isFirstMoveLastTurn = this.isFirstMoveLastTurn;
    return pawn;
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
        return super.isLegalMovement(positions, isCheckBoard, game);
      return false;
    }
    return false;
  }
}
class King extends ChessPiece
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
  constructor(isWhite: boolean)
  {
    super(isWhite);
  }
  override copy(): ChessPiece {
    let king = new King(this.getWhite());
    king.hasMoved = this.hasMoved;
    return king;
  }
  override returnLegalMoves(isCheckBoard: boolean, game: ChessGame, startPosition?: Position, moves?: MovePosition[]): MovePosition[] {
    if (startPosition === undefined)
      return [];
    let returnMoves : MovePosition[] = [];
    for (let i = -1; i<= 1; i++)
    {
      for (let j = -1; j<= 1; j++)
      {
        if (new Position(startPosition.getRow()+i, startPosition.getCol()+j).isLegalPosition() &&
        this.isLegalMovement(new MovePosition(startPosition,
        new Position(startPosition.getRow()+i, startPosition.getCol()+j)), isCheckBoard, game))
          returnMoves.push(new MovePosition(startPosition,new Position(startPosition.getRow()+i, startPosition.getCol()+j)));
      }
    }
    if (!this.hasMoved) // castling - not checking if threatened (in game)
    {
      if (this.isCastlingLegal(0, startPosition, game, isCheckBoard))
        returnMoves.push(new MovePosition(startPosition, new Position(startPosition.getRow(), 2)));
      if (this.isCastlingLegal(7, startPosition, game, isCheckBoard))
        returnMoves.push(new MovePosition(startPosition, new Position(startPosition.getRow(), 6)));
    }
    return returnMoves;
  }
  isCastlingLegal(col:number, pos:Position, game: ChessGame, isCheckBoard: boolean) : boolean
  {
    const r = game.getPieceFromBoard(new Position(pos.getRow(),
      col),isCheckBoard);
    if (r instanceof Rook && !r.getMoved())
    {
      const min = Math.min(pos.getCol(), col), max = Math.max(pos.getCol(), col);
      for (let i = min+1; i < max; i++)
      {
        if (game.getPieceFromBoard(new Position(pos.getRow(), i), isCheckBoard) !== null)
          return false;
      }
      return true;
    }
    return false;
  }
  //honestly remove is legal movement this is for server
  override isLegalMovement(positions: MovePosition, isCheckBoard: boolean, game: ChessGame): boolean {
    if (positions.getRowAbs() <= 1 && positions.getRowAbs() <= 1)
      return super.isLegalMovement(positions, isCheckBoard, game);
    if (positions.getRowAbs() === 0 && !this.hasMoved && game.getPieceFromBoard(positions.getNewPos(),isCheckBoard) instanceof Rook)
    {
      const rook =  game.getPieceFromBoard(positions.getNewPos(),isCheckBoard) as Rook;
      if (!rook.getMoved() && rook.getWhite() === super.getWhite())
      {
        //for () king not threatented TODO
        return true;
      }
    }
    return false;
  }
}
class ChessGame
{
  private board!: (ChessPiece | null)[][];
  private checkBoard!: (ChessPiece | null)[][];
  private isWhiteTurn: boolean = true;
  private isWhitePlayer!: boolean;
  private isPromotion = false;
  public getIsWaitingForPromotion()
  {
    return this.isPromotion;
  }
  getPieceFromBoard(pos: Position, isCheckBoard:boolean): (ChessPiece | null)
  {
    if (pos.getRow() >= 0 && pos.getRow() < 8 && pos.getCol() >= 0 && pos.getCol() < 8)
    {
      if (!isCheckBoard)
        return this.board[pos.getRow()][pos.getCol()];
      else
        return this.checkBoard[pos.getRow()][pos.getCol()];
    }
    throw Error("path");
    console.log('bug');
    return null;
  }
  getNewElem():ChessPiece | null //??
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
      if (!this.checkBoard[i])
        this.checkBoard[i]=[];
      const isWhite = i<3? false : true; 
      for( let j = 0; j< 8; j++)
      {
        let elem!: ChessPiece | null;
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
        this.checkBoard[i].push(null);
      }
    }
  }
  setMovePlayer(movePosition: MovePosition)
  {
    if (this.getPieceFromBoard(movePosition.getOldPos(), false)?.getWhite()
       !== this.isWhitePlayer)
    {
      console.log('bug');
      return;
    }
    this.setMove(movePosition);
  } 
  setPawnsLastMoveTurn(pos:Position)
  {
    for (let i =0; i< 8; i++)
    {
      for (let j=0;j<8;j++)
      {
        let pawn = this.board[i][j];
        if (!(i=== pos.getRow() && j===pos.getCol()) && 
         pawn instanceof Pawn)
          {
            pawn.setHasMovedTurn();
          }
      }
    }
  }
  private setMove(movePosition: MovePosition)
  {
    const piece = this.getPieceFromBoard(movePosition.getOldPos(), false);
    if (piece === null || this.isPromotion)
    {
      console.log('bug');
      return;
    }
    const isLegalMove =  piece.returnLegalMoves(false, this, movePosition.getOldPos()).filter(m =>
      m.getNewRow() === movePosition.getNewRow() &&
      m.getNewCol() === movePosition.getNewCol()
    )
    if (isLegalMove !== undefined)
    {
      if (piece instanceof Pawn && ((piece.getWhite() && 
      movePosition.getNewRow() === 0) || (!piece.getWhite() && 
      movePosition.getNewRow() === 7)))
        this.isPromotion = true;
      if (piece instanceof Pawn && movePosition.getColAbs() === 1 && 
      movePosition.getRowAbs() === 1 && 
      this.getPieceFromBoard(movePosition.getNewPos(), false) === null)
        this.board[movePosition.getOldRow()][movePosition.getNewCol()] = null;
      if (piece instanceof King && movePosition.getColAbs() === 2)
      {
        let rook;
        let rookOldCol = movePosition.getOldCol() > movePosition.getNewCol() ? 0 : 7;
        rook = this.board[movePosition.getOldRow()][rookOldCol];
        this.board[movePosition.getOldRow()][rookOldCol] = null;
        this.board[movePosition.getOldRow()][movePosition.getOldCol()+ 
        (movePosition.getNewCol()-movePosition.getOldCol())/2] =  rook;
        if (rook instanceof Rook)
          rook.setMoved();
      }
      if (piece instanceof Pawn || piece instanceof Rook || piece instanceof King)
        piece.setMoved();
      this.board[movePosition.getNewRow()][movePosition.getNewCol()] = 
      this.board[movePosition.getOldRow()][movePosition.getOldCol()];
      this.board[movePosition.getOldRow()][movePosition.getOldCol()] = null; 
      this.setPawnsLastMoveTurn(movePosition.getNewPos());
      this.isWhiteTurn = !this.isWhiteTurn; 
    }
  }
  private setCheckBoard()
  {
    for (let i = 0; i< 8; i++)
    {
      for (let j=0; j<8; j++)
      {
        const piece = this.board[i][j];
        if (piece != null)
          this.checkBoard[i][j] = piece.copy();
        else
          this.checkBoard[i][j] = null;
      }
    }
  }
  setMoveOpposition(movePosition: MovePosition)
  {
    if (this.getPieceFromBoard(movePosition.getOldPos(), false)?.getWhite()
       === this.isWhitePlayer)
    {
      console.log('bug');
      return;
    }
    this.setMove(movePosition);
  }
  isMoveLeadToCheck(move:MovePosition) : boolean 
  {
    if (move.getNewPos() === null)
    {
      console.log('error');
      return true;
    }
    this.setCheckBoard();
    const piece = this.getPieceFromBoard(move.getOldPos(), false);
    const toEat = this.getPieceFromBoard(move.getNewPos(), false);
    if (piece instanceof Pawn && move.getColAbs() === 1 &&
    move.getRowAbs() === 1 && toEat === null)
      this.checkBoard[move.getOldRow()][move.getNewCol()] = null;
    if (piece instanceof King && move.getColAbs() === 2)
    {
      if (this.isInCheck())
        return true;
      //check recorsive
      this.checkBoard[move.getOldPos().getRow()][move.getOldPos().getCol()] = null;
      this.checkBoard[move.getOldPos().getRow()][move.getOldPos().getCol()+ 
        (move.getNewPos().getCol()-move.getOldPos().getCol())/2] = piece;
      piece.setMoved();
      if (this.isInCheck())
        return true;
      let rook;
      if (move.getNewCol() > move.getOldCol())
      {
        rook = this.checkBoard[move.getOldPos().getRow()][7];
        this.checkBoard[move.getOldPos().getRow()][7] = null;
      } 
      else
      {
        rook = this.checkBoard[move.getOldPos().getRow()][0];
        this.checkBoard[move.getOldPos().getRow()][0] = null;
      }
      this.checkBoard[move.getOldPos().getRow()][move.getOldPos().getCol()+ 
        (move.getNewPos().getCol()-move.getOldPos().getCol())/2] = rook;
      if (rook instanceof Rook)
        rook.setMoved();
      this.checkBoard[move.getOldPos().getRow()][move.getOldPos().getCol()] = piece;
      this.checkBoard[move.getOldPos().getRow()][move.getOldPos().getCol()+ 
        (move.getNewPos().getCol()-move.getOldPos().getCol())/2]
    }
    this.checkBoard[move.getNewPos().getRow()][move.getNewPos().getCol()]= piece;
    this.checkBoard[move.getOldPos().getRow()][move.getOldPos().getCol()] = null;
    return this.isInCheck();
  }
  isInCheck():boolean
  {
    let kingPosition!: Position;
    for (let i = 0; i< 8; i++)
    {
      for (let j = 0; j < 8; j++)
      {
        if (this.checkBoard[i][j] instanceof King && 
          this.checkBoard[i][j]?.getWhite() === this.isWhitePlayer)
          kingPosition = new Position(i, j);
      }
    }
    if (kingPosition === undefined)
      console.log('missing king');
   for (let i = 0; i< 8; i++)
    {
      for (let j = 0; j < 8; j++)
      {
        if (this.checkBoard[i][j] instanceof ChessPiece &&
          this.checkBoard[i][j]?.getWhite() !== this.isWhitePlayer)
        {
          const potentialMoves = this.checkBoard[i][j]?.returnLegalMoves(true, this, new Position(i,j));
          if (potentialMoves === undefined || potentialMoves.length === 0)
            continue;
          const isCheckMove = potentialMoves.find(m => 
            m.getNewRow() === kingPosition.getRow() && m.getNewCol() === kingPosition.getCol())
          if (isCheckMove !== undefined)
          {
            console.log('winning move: from',isCheckMove?.getOldRow(),isCheckMove?.getOldCol()+"to "+ kingPosition.getRow()+ kingPosition.getCol());
            return true;
          }
        }
      }
    }
    return false;
  }
  getMovesForPiece(startPosition: Position): MovePosition[] | null
  {
    const piece = this.getPieceFromBoard(startPosition,false);
    let movesToCheck : MovePosition[] = [];
    if ((this.isWhiteTurn !== this.isWhitePlayer) || 
    piece === null || piece.getWhite() !== this.isWhitePlayer)
      return null;
    movesToCheck.push(...piece.returnLegalMoves(false, this, startPosition));
    return movesToCheck.filter(m => !this.isMoveLeadToCheck(m));
  }
  setPromotion(pos:Position, promotionChar:string) //no checking
  //if there's bug here then ehhh
  {
    let piece: ChessPiece | null = null;
    const pawn = this.getPieceFromBoard(pos,false);
    if (pawn instanceof Pawn)
    {
      switch (promotionChar[0])
      {
        case 'q':
          piece = new Queen(pawn.getWhite());
          break;
        case 'b':
          piece = new Bishop(pawn.getWhite());
          break;
        case 'n':
          piece = new Knight(pawn.getWhite());
          break;
        case 'r':
          let rook = new Rook(pawn.getWhite());
          rook.setMoved();
          piece = rook;
          break;
      }
      this.board[pos.getRow()][pos.getCol()] = piece;
      this.isPromotion = false;
    }
  }
}
export class Utility
{
  static stringToMovePos(movement:string)
  {
    // if (movement.length !== 4)
    //   return null;
    const oldPos = this.standardToNum(movement.substring(0,2));
    const newPos = this.standardToNum(movement.substring(2,4));
    return new MovePosition(oldPos, newPos);
  }
  static numToStandard(pos:Position): string
  {
    return String.fromCharCode(pos.getCol()+'A'.charCodeAt(0))
    +String.fromCharCode('8'.charCodeAt(0)-pos.getRow());
  }
  static standardToNum(code:string):Position
  {
    const col = code.charCodeAt(0) - 'A'.charCodeAt(0);
    return new Position(8-parseInt(code[1]),col);
  }
  standardToInt(code:string):number[]
  {
    const col = code.charCodeAt(0) - 'A'.charCodeAt(0);
    const arr: number[] =[];
    arr.push(8-parseInt(code[1]));
    arr.push(col);
    return arr;
  }
  static movePositionsToString(moves: MovePosition[]): string[]
  {
    let res: string[] = [];
    moves.forEach(move =>
    {
      res.push(this.numToStandard(move.getOldPos())
      +this.numToStandard(move.getNewPos()));
    });
    return res;
  }
}
@Injectable({
  providedIn: 'root'
})
export class Gamelogic {
  game!: ChessGame;
  listOfPossibleMoves!: MovePosition[] | null;
  startNewGame(isWhitePlayer:boolean)
  {
    this.game = new ChessGame(isWhitePlayer);
  }
  getMovesForPiece(code:string) : null | string[]
  {
    this.listOfPossibleMoves = this.game.getMovesForPiece(Utility.standardToNum(code));
    if (this.listOfPossibleMoves === null)
      return null;
    return Utility.movePositionsToString(this.listOfPossibleMoves);
  }
  setMove(code:string)
  {
    const move = new MovePosition(Utility.standardToNum(code[0]+code[1]),Utility.standardToNum(code[2]+code[3]));
    if (this.listOfPossibleMoves?.filter(
      m=>
        m.getOldCol() === move.getOldCol()&&
        m.getOldRow() === move.getOldRow() &&
        m.getNewCol() === move.getNewCol() &&
        m.getNewRow() === move.getNewRow()
    ) !== undefined)
      this.game.setMovePlayer(move);
      //send server move
  }

  //white row 6,7. black rows 0,1.
  //col 3-q,4-k 
  //promotion, win, lose, draw - special message
    //if castling move two, if enpassant kill the other pawn.
       
    //en passant
    //do move
    //promotion
    //save history
  //info from server: move, promotion, win, lose, draw  
}
