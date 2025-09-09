import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ReturnTokensModel } from '../models/return-tokens-model';
import { SignUpModel } from '../models/sign-up-model';
import { LoginModel } from '../models/login-model';
import { ReturnLoggedUsersModel } from '../models/return-logged-users-model';
import { ClientMessageModel } from '../models/client-message-model';
import { ClientConversationModel } from '../models/client-conversation-model';
@Injectable({
  providedIn: 'root'
})
export class Client {
  private http = inject(HttpClient);
  private userName:string = 'guest';
  private isLogged = false;
  public isGameRequestPopUp : BehaviorSubject<boolean> 
  = new BehaviorSubject<boolean>(false);
  getUserName()
  {
    return this.userName;
  }
  getLoggedInStatus()
  {
    return this.isLogged;
  }
  setLoggedInStatus(isLogged: boolean)
  {
    this.isLogged = isLogged; 
  }
  setUserName(name:string)
  {
    this.userName = name;
  }
  serverUrl = "https://localhost:7070/";

  public activate() : Observable<ReturnTokensModel>
  {
    return this.http.get<ReturnTokensModel>(this.serverUrl+"Activate");
  }
  public register(signUp: SignUpModel): Observable<void>
  {
    return this.http.post<void>(this.serverUrl+"Register", signUp)
  }
  public login(login: LoginModel): Observable<string>
  {
    return this.http.post<string>(this.serverUrl+"Login", login, 
      { responseType: 'text' as 'json'});
  }
  public search(query:string): Observable<(string | null)[] | null>
  {
    return this.http.get<(string | null)[] | null>(this.serverUrl+"Search/"+query);
  }
  public getLoggedUsersForChat():Observable<ReturnLoggedUsersModel[] | null>
  {
    return this.http.get< ReturnLoggedUsersModel[] | null>(this.serverUrl + "LoggedUsers");
  }
  public sendMessageToUser(message: ClientMessageModel):Observable<void>
  {
    return this.http.post<void>(this.serverUrl,message);
  }
  public getConversationWithParter(partner:string):Observable<ClientConversationModel>
  {
    return  this.http.get<ClientConversationModel>(this.serverUrl+"Chat/"+partner);
  }
  public getAvailablePlayers():Observable<string[]>
  {
    return this.http.get<string[]>(this.serverUrl+"Players");
  }
  public sendGameRequest(userName :string):Observable<boolean>
  {
    return this.http.post<boolean>(this.serverUrl+"GameRequest/"+userName,null);
  }
  // get and send user details,
  // chess communication in chess logic?
}
