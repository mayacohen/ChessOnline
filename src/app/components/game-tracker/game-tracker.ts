import { Component, OnInit } from '@angular/core';
import { Gamelogic } from '../../services/gamelogic';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-game-tracker',
  imports: [CommonModule],
  templateUrl: './game-tracker.html',
  styleUrl: './game-tracker.scss'
})
export class GameTracker implements OnInit{
  Moves:string[][] = [];
  constructor(private gamelogic: Gamelogic){}
  ngOnInit(): void {
    this.Moves[0] = [];
    this.Moves[0].push("F4");
    this.Moves[0].push("D5");
    this.Moves[1] = [];
    this.Moves[1].push("Nc3");
    this.Moves[1].push('Bf5');
  }

}
