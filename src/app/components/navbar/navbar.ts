import { Component } from '@angular/core';
import { Signup } from '../signup/signup';
import { CommonModule } from '@angular/common';
import { Login } from '../login/login';
import { FormsModule } from '@angular/forms';
import { RequestGameModal } from '../request-game-modal/request-game-modal';
import { Social } from '../social/social';
import { LoggedInUserModel } from '../../models/logged-in-user-model';
import { ActiveUserModel } from '../../models/active-user-model';
import { Client } from '../../services/client';
@Component({
  selector: 'app-navbar',
  imports: [Signup, CommonModule, Login, FormsModule, 
    RequestGameModal, Social],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  isSignupModalOpen = false;
  isLoginModalOpen = false;
  isRequestGameModalOpen = false;
  isSocialModalOpen = false;
  darkUI = 'Dark UI';
  lightUI = 'Light UI';
  currentUI = this.lightUI;
  userChat: LoggedInUserModel = {username : '', 
      userImg: 'example.png', id:'', score:0};  
  searchQuery='';
  constructor(private client:Client){}
  closeSignupModal()
  {
    this.isSignupModalOpen = false;
  }
  closeLoginModal()
  {
    this.isLoginModalOpen = false;
  }
  handleSocial()
  {
    if (this.client.getLoggedInStatus())
      this.isSocialModalOpen = !this.isSocialModalOpen;
    else
      this.isLoginModalOpen = !this.isLoginModalOpen;
  }
  handleGameRequestModal()
  {
    this.isRequestGameModalOpen = false;
  }
}
