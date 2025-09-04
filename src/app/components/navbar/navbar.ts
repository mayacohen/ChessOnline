import { Component, ChangeDetectorRef } from '@angular/core';
import { Signup } from '../signup/signup';
import { CommonModule } from '@angular/common';
import { Login } from '../login/login';
import { FormsModule } from '@angular/forms';
import { RequestGameModal } from '../request-game-modal/request-game-modal';
import { Social } from '../social/social';
import { LoggedInUserModel } from '../../models/logged-in-user-model';
import { SearchModal } from '../search-modal/search-modal';
import { Client } from '../../services/client';
@Component({
  selector: 'app-navbar',
  imports: [Signup, CommonModule, Login, FormsModule, 
    RequestGameModal, Social, SearchModal],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar{
  isSearchModalOpen = false;
  isSignupModalOpen = false;
  isLoginModalOpen = false;
  isRequestGameModalOpen = false;
  isSocialModalOpen = false;
  loginMessage = "Log In";
  logoutMessage = "Log Out";
  currentLoginMessage = this.loginMessage;
  darkUI = 'Dark UI';
  lightUI = 'Light UI';
  currentUI = this.lightUI;
  userChat: LoggedInUserModel = {username : '', 
      userImg: 'example.png', id:'', score:0};  
  searchQuery=''; //search for users
  userList : (string | null)[] = [];
  constructor(private client:Client, private cdr: ChangeDetectorRef){}
  closeSignupModal()
  {
    this.isSignupModalOpen = false;
  }
  closeLoginModal()
  {
    if (this.client.getLoggedInStatus())
      this.currentLoginMessage = this.logoutMessage;
    this.isLoginModalOpen = false;
  }
  LogInLogOut()
  {
    if (!this.client.getLoggedInStatus())
      this.isLoginModalOpen = !this.isLoginModalOpen;
    else
    {
      this.client.setLoggedInStatus(false);
      this.client.setUserName("Guest");
      sessionStorage.clear();
      localStorage.clear();
      this.currentLoginMessage = this.loginMessage;
      this.client.activate().subscribe({next: response =>
      {
        sessionStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken); 
      },
      error: err => console.log(err)
    });
    }
  }
  handleSocial()
  {
    if (!this.client.getLoggedInStatus())
      this.isLoginModalOpen = !this.isLoginModalOpen;
    else
    {     
      this.isSocialModalOpen = !this.isSocialModalOpen;
    }
  }
  handleGameRequestModal()
  {
    this.isRequestGameModalOpen = false;
  }
  onSearchChange(query: string)
  {
    if (query.length > 2)
    {
      this.client.search(query).subscribe({
          next: userlist => {
            if (userlist != null)
            {
              this.userList = userlist;
              this.isSearchModalOpen = true;
              this.cdr.detectChanges();
              userlist.forEach(
                u => console.log(u)
              );
            }
          },
          error: err => console.log(err) 
      });
    }
    else
    {
      this.userList = [];
      this.isSearchModalOpen = false;
    }
  }
}
