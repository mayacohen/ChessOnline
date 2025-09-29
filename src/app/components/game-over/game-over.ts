import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-game-over',
  imports: [],
  templateUrl: './game-over.html',
  styleUrl: './game-over.scss'
})
export class GameOver {
  @Input() gameOverType = '';
  @Input() opponentUserName = '';
  @Output() closeModalOutput = new EventEmitter<void>();
  closeModal()
  {
    this.closeModalOutput.emit();
  }
}
