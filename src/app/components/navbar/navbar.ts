import { Component } from '@angular/core';
import { Signup } from '../signup/signup';
import { CommonModule } from '@angular/common';
import { Login } from '../login/login';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [Signup, CommonModule, Login, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  isSignupModalOpen = false;
  isLoginModalOpen = false;
  darkUI = 'Dark UI';
  lightUI = 'Light UI';
  currentUI = this.lightUI;
  searchQuery='';
  closeSignupModal()
  {
    this.isSignupModalOpen = false;
  }
  closeLoginModal()
  {
    this.isLoginModalOpen = false;
  }
}
