import { Component, Input } from '@angular/core';
import { ActiveUserModel } from '../../models/active-user-model';
@Component({
  selector: 'app-player-details-for-game',
  imports: [],
  templateUrl: './player-details-for-game.html',
  styleUrl: './player-details-for-game.scss'
})
export class PlayerDetailsForGame {
   @Input() user : ActiveUserModel = {username: 'Guest', userImg: 'example.png'
     , score: null}; 

}
