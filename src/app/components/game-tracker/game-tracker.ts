import { Component, OnInit } from '@angular/core';
import { Client } from '../../services/client';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-game-tracker',
  imports: [CommonModule],
  templateUrl: './game-tracker.html',
  styleUrl: './game-tracker.scss'
})
export class GameTracker implements OnInit{
  Moves:string[][] = [];
  constructor(private client:Client ){}
  ngOnInit(): void {
    this.Moves[0] = [];
    this.client.newTrackingMove.subscribe({
      next: move => {
        if (this.Moves[this.Moves.length-1].length >= 2)
          this.Moves.push([]);
        this.Moves[this.Moves.length-1].push(move);   
      },
      error: err => console.log(err)  
    });
  }

}
