import { Component, Output, EventEmitter } from '@angular/core';
import { ActiveUserModel } from '../../models/active-user-model';
import { CommonModule } from '@angular/common';
import { PlayerDetailsForGame } from '../player-details-for-game/player-details-for-game';
import { FormsModule } from '@angular/forms';
import { RequestConfirmation } from '../request-confirmation/request-confirmation';
@Component({
  selector: 'app-request-game-modal',
  imports: [CommonModule, PlayerDetailsForGame, FormsModule, 
    RequestConfirmation],
  templateUrl: './request-game-modal.html',
  styleUrl: './request-game-modal.scss'
})
export class RequestGameModal {
  activeUsers: ActiveUserModel[] = [];
  searchQuery : string = ''; //not init yet
  isRequestConfirmation = false;
  userGame: ActiveUserModel = {username : '', 
      userImg: 'example.png', id:'', score:0};
  @Output() resultEmitter = new EventEmitter<void>(); 
  closeModal()
  {
    this.resultEmitter.emit();
  }
  sendGameRequest(user: ActiveUserModel)
  {
    this.userGame = user;
    this.isRequestConfirmation = true;
  }
  unexpectedEventsHandler(event:Event)
  {
    event.stopPropagation();
    event.preventDefault();
  }
  handleRequestConfirmation(retValue: boolean)
  {
    this.isRequestConfirmation = false;
    if (retValue)
    {
      //send http request to gameUser
      //handle answer
    }
  }
}
