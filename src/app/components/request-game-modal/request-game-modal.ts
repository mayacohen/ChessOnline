import { Component, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerDetailsForGame } from '../player-details-for-game/player-details-for-game';
import { FormsModule } from '@angular/forms';
import { RequestConfirmation } from '../request-confirmation/request-confirmation';
import { Client } from '../../services/client';
@Component({
  selector: 'app-request-game-modal',
  imports: [CommonModule, PlayerDetailsForGame, FormsModule, 
    RequestConfirmation],
  templateUrl: './request-game-modal.html',
  styleUrl: './request-game-modal.scss'
})
export class RequestGameModal implements OnInit{
  activeUsers: string[] = [];
  searchQuery : string = ''; //not init yet
  isRequestConfirmation = false;
  userGame: string = '';
  @Output() resultEmitter = new EventEmitter<void>(); 
  emptyMessage = "Loading Users..";
  constructor (private client:Client, private cdr: ChangeDetectorRef){}
  ngOnInit(): void {
    this.client.getAvailablePlayers().subscribe({
      next: list => 
        {
          this.activeUsers = list;
          this.emptyMessage = "No one is online right now";
          this.cdr.detectChanges();
        },
      error: err => console.log(err)
    });
  }
  closeModal()
  {
    this.resultEmitter.emit();
  }
  sendGameRequest(user: string)
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
      this.client.sendGameRequest(this.userGame).subscribe({
        next: b => 
          {
            console.log('request sent');
            //open modal - message sent, waiting. 2:30 min is eanough?
            //reject etc handle.  
          },
          //write that a request couldn't be sent or whatever
        error: err => console.log('issue - don\'t fix'),
      })
      //send http request to gameUser
      //handle answer
    }
  }
}
