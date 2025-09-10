import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

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
  acceptOrConfirm = "Confirm";
  cancelOrReject = "Cancel";
  displayedText = "";
  ngOnInit(): void {
    if (this.isChallenging)
    {
      this.displayedText = "Do you want to challenge "+ this.requestUser
      +" to a game of chess?";
      this.acceptOrConfirm = "Accept";
      this.cancelOrReject = "Reject";
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