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
  emptyMessage = 'Start playing and enter the league!';
  constructor(private client:Client, private cdr:ChangeDetectorRef){}
  ngOnInit(): void {
    this.recoursiveGetLeague(100);
  }
  recoursiveGetLeague(time:number)
  {
    if (time > 1000)
    {
      this.emptyMessage = "Encountering some difficulties retriving the data, "
      "try again later";
      this.cdr.detectChanges();
      return;
    }
    this.client.getLeague().subscribe({next: res =>
        this.leagueResults = res,
      error: () => {
          this.emptyMessage = "Loading users...";
          setTimeout(() => this.recoursiveGetLeague(time+100),time);
      }});
  }
  exitScreen()
  {
    this.exit.emit();
  }
}
