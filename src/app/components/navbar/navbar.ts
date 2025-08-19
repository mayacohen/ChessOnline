import { Component } from '@angular/core';
import { Signup } from '../signup/signup';
import { CommonModule } from '@angular/common';
import { Login } from '../login/login';
import { FormsModule } from '@angular/forms';
import { RequestConfirmation } from '../request-confirmation/request-confirmation';
import { RequestGameModal } from '../request-game-modal/request-game-modal';
import { Social } from '../social/social';
import { Chat } from '../chat/chat';
import { LoggedInUserModel } from '../../models/logged-in-user-model';
import { ActiveUserModel } from '../../models/active-user-model';
@Component({
  selector: 'app-navbar',
  imports: [Signup, CommonModule, Login, FormsModule, 
    RequestConfirmation, RequestGameModal, Social, Chat],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  isSignupModalOpen = false;
  isLoginModalOpen = false;
  isRequestConfirmation = false;
  isRequestGameModalOpen = false;
  isChatModalOpen = false;
  darkUI = 'Dark UI';
  lightUI = 'Light UI';
  currentUI = this.lightUI;
  userChat: LoggedInUserModel = {username : '', 
      userImg: 'example.png', id:'', score:0}; 
  userGame: ActiveUserModel = {username : '', 
      userImg: 'example.png', id:'', score:0}; 
  searchQuery='';
  closeSignupModal()
  {
    this.isSignupModalOpen = false;
  }
  closeLoginModal()
  {
    this.isLoginModalOpen = false;
  }
  closeChatModal()
  {
    this.isChatModalOpen = false;
  }
  closeGameRequestModal()
  {
    this.isRequestGameModalOpen = false;
  }
}
