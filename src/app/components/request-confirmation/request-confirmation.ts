import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Client } from '../../services/client';
@Component({
  selector: 'app-request-confirmation',
  imports: [],
  templateUrl: './request-confirmation.html',
  styleUrl: './request-confirmation.scss'
})
export class RequestConfirmation implements OnInit{
  @Input() requestUser: string =''; 
  @Output() emitIsConfirm = new EventEmitter<boolean>();
  @Input() isChallenging : boolean = true; 
  acceptOrConfirm = "Accept";
  cancelOrReject = "Reject";
  displayedText = "";
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
    + " to a game of chess. Do You accept?"
  }
  onCancel()
  {
    this.emitIsConfirm.emit(false);
  }
  onConfirm()
  {
     this.emitIsConfirm.emit(true);
  }
}