import { Component, Output, EventEmitter } from '@angular/core';
import { ActiveUserModel } from '../../models/active-user-model';
import { CommonModule } from '@angular/common';
import { PlayerDetailsForGame } from '../player-details-for-game/player-details-for-game';

@Component({
  selector: 'app-request-game-modal',
  imports: [CommonModule, PlayerDetailsForGame],
  templateUrl: './request-game-modal.html',
  styleUrl: './request-game-modal.scss'
})
export class RequestGameModal {
  activeUsers: ActiveUserModel[] = [];
  @Output() closeModalEmitter = new EventEmitter<void>(); 
  closeModal()
  {
    this.closeModalEmitter.emit();
  }
}
