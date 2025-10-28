import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef} from '@angular/core';
import { ClientLeagueModel } from '../../models/client-league-model';
import { CommonModule } from '@angular/common';
import { Client } from '../../services/client';

@Component({
  selector: 'app-league-screen',
  imports: [CommonModule],
  templateUrl: './league-screen.html',
  styleUrl: './league-screen.scss'
})
export class LeagueScreen implements OnInit{
  leagueResults!: ClientLeagueModel[] | null;
  @Output() exit = new EventEmitter<void>();
  constructor(private client:Client, private cdr:ChangeDetectorRef){}
  ngOnInit(): void {
    this.client.getLeague().subscribe({
      next: res => {this.leagueResults = res;
        this.cdr.detectChanges();
      },
      error : err => console.log(err)
    });
  }
  exitScreen()
  {
    this.exit.emit();
  }
}
