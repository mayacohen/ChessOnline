import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Client } from '../../services/client';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RequestConfirmationReturnValue } from '../../models/request-confirmation-return-value';
@Component({
  selector: 'app-request-confirmation',
  imports: [CommonModule, FormsModule],
  templateUrl: './request-confirmation.html',
  styleUrl: './request-confirmation.scss'
})
export class RequestConfirmation implements OnInit{
  @Input() requestUser: string =''; 
  @Output() emitIsConfirm = new EventEmitter<RequestConfirmationReturnValue>();
  @Input() isChallenging : boolean = true; 
  acceptOrConfirm = "Accept";
  cancelOrReject = "Reject";
  displayedText = "";
  @Input() timer : number = 30;
  constructor (private client:Client){}
  ngOnInit(): void {
    this.client.gameOpponent = this.requestUser;
    if (this.isChallenging)
    {
      this.displayedText = "Do you want to challenge "+ this.requestUser
      +" to a game of chess?";
      this.acceptOrConfirm = "Confirm";
      this.cancelOrReject = "Cancel";
    }
    else
      this.displayedText = "You were challenged by " + this.requestUser
    + " to a game of chess with a time limit of "+this.timer +" min. Do You accept?"
  }
  onCancel()
  {
    return this.emitIsConfirm.emit({isAccepting: false, timer: this.isChallenging? this.timer : null});
  }
  onConfirm()
  {
    return this.emitIsConfirm.emit({isAccepting: true, timer: this.isChallenging? this.timer : null});
  }
}