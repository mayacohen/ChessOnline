import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Board } from '../../components/board/board';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-main',
  imports: [Navbar, Board, CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {
}
