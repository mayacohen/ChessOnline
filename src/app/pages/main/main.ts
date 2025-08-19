import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Board } from '../../components/board/board';
import { Chat } from '../../components/chat/chat';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-main',
  imports: [Navbar, Board, Chat, CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {
  isChatModalOpen=false;
  closeChatModal()
  {
    this.isChatModalOpen = false;
  }
}
