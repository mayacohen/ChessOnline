import { Component, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerDetailsForGame } from '../player-details-for-game/player-details-for-game';
import { FormsModule } from '@angular/forms';
import { RequestConfirmation } from '../request-confirmation/request-confirmation';
import { Client } from '../../services/client';
import { RequestConfirmationReturnValue } from '../../models/request-confirmation-return-value';
import { WaitModal } from '../wait-modal/wait-modal';
import { timeout } from 'rxjs';
@Component({
  selector: 'app-request-game-modal',
  imports: [CommonModule, /*PlayerDetailsForGame,*/ FormsModule, 
    RequestConfirmation, WaitModal],
  templateUrl: './request-game-modal.html',
  styleUrl: './request-game-modal.scss'
})
export class RequestGameModal implements OnInit{
  activeUsers: string[] = [];
  searchQuery : string = ''; //not init yet
  isRequestConfirmation = false;
  userGame: string = '';
  isWaitModalOpen = false;
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
    this.client.rejectedResponseUser.subscribe({
      next: rejctedUserName => {
        this.isWaitModalOpen = false;
        this.cdr.detectChanges();
        setTimeout(()=>
          {
            this.blockUserFromGameRequest(document.getElementById(rejctedUserName));
            this.cdr.detectChanges();
          }
      ,100);
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
    this.cdr.detectChanges();
  }
  unexpectedEventsHandler(event:Event)
  {
    event.stopPropagation();
    event.preventDefault();
  }
  handleRequestConfirmation(retValue: RequestConfirmationReturnValue)
  {
    this.isRequestConfirmation = false;
    if (retValue.isAccepting && retValue.timer !== null)
    {
      this.client.sendGameRequest(this.userGame, retValue.timer).subscribe({
        next: b => 
            {
              console.log('request sent');
              this.isWaitModalOpen = true;
              this.cdr.detectChanges();
              setTimeout(()=>
                {
                  this.isWaitModalOpen = false;
                  this.cdr.detectChanges();
                }
              , 2*60*1000);
            },
          //set to wait - don't send more messages
          //write that a request couldn't be sent or whatever
        error: err => {
          console.log('can\'t send');
          this.blockUserFromGameRequest(document.getElementById(this.userGame));
        },
      })
      //send http request to gameUser
      //handle answer
    }
  }
  blockUserFromGameRequest(elemToDisable:HTMLElement | null)
  {
    if (elemToDisable !== null)
          {
            elemToDisable.style.pointerEvents = "none";
            elemToDisable.style.opacity = "0.7";
          }
  }
}
