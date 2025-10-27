import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ReturnTokensModel } from '../models/return-tokens-model';
import { SignUpModel } from '../models/sign-up-model';
import { LoginModel } from '../models/login-model';
import { ReturnLoggedUsersModel } from '../models/return-logged-users-model';
import { ClientMessageModel } from '../models/client-message-model';
import { ClientConversationModel } from '../models/client-conversation-model';
import { ClientServerMessage } from '../models/client-server-message';
import { LoggedDTO } from '../models/logged-dto';
import { StringReturn } from '../models/string-return';
import { LoggedUserReturnModel } from '../models/logged-user-return-model';
import { PopupMessageModel } from '../models/popup-message-model';
import { EmailChangeModel } from '../models/email-change-model';
import { UsernameChangeModel } from '../models/username-change-model';
import { PasswordChangeModel } from '../models/password-change-model';
import { ClientLeagueModel } from '../models/client-league-model';
import { PersonalDetails } from '../models/personal-details';
@Injectable({
  providedIn: 'root'
})
export class Client {
  private http = inject(HttpClient);
  private userName:string = 'guest';
  private isLogged = false;
  private userPic = "example.png";
  public gameOpponent = "";
  public getUserPic()
  {
    return this.userPic;
  }
  public setUserPic(userPic:string)
  {
    this.userPic = userPic;
  }
  public isGameRequestPopUp : BehaviorSubject<boolean> 
  = new BehaviorSubject<boolean>(false);
  private defaultCSM : ClientServerMessage ={
     content: null,
    senderUserName : null,
    receiverUserName : null,
    date : null,
    type : "default"
  };   
  public newServerGameData : BehaviorSubject<ClientServerMessage>
  = new BehaviorSubject<ClientServerMessage>(this.defaultCSM);
  public newTrackingMove : Subject<string>
  = new Subject<string>;
  public rejectedResponseUser : Subject<string> = new Subject<string>;
  public newMessage: Subject<PopupMessageModel> = new Subject<PopupMessageModel>;
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
  public login(login: LoginModel): Observable<LoggedDTO>
  {
    return this.http.post<LoggedDTO>(this.serverUrl+"Login", login);
  }
  public search(query:string): Observable<(string | null)[] | null>
  {
    return this.http.get<(string | null)[] | null>(this.serverUrl+"Search/"+query);
  }
  public getLeague():Observable<ClientLeagueModel[] | null>
  {
    return this.http.get<ClientLeagueModel[] | null>(this.serverUrl+"League"); 
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
  public sendGameRequest(userName :string, timer:number):Observable<boolean>
  {
    return this.http.post<boolean>(this.serverUrl+"GameRequest/"+userName,timer);
  }
  public handleGameRequestResponse(m: ClientServerMessage) : Observable<void>
  {
    return this.http.put<void>(this.serverUrl+"GameResponse",m);
  }
  public setMove(m: ClientServerMessage) : Observable<StringReturn>
  {
    return this.http.put<StringReturn>(this.serverUrl+"GameMove",m);
  }
  public setPromotion(m: ClientServerMessage) : Observable<StringReturn>
  {
    return this.http.put<StringReturn>(this.serverUrl+"Promotion",m);
  }
  public retryMove(m:ClientServerMessage): Observable<void>
  {
    return this.http.put<void>(this.serverUrl+"Retry",m);
  }
  public withdrawGame(m:ClientServerMessage): Observable<void>
  {
    return this.http.put<void>(this.serverUrl+"Withdraw",m);
  }
  public getLoggedUserDetails(userName:string):Observable<LoggedUserReturnModel>
  {
    return this.http.get<LoggedUserReturnModel>(this.serverUrl+"LoggedUser/"+userName);
  }
  public addFriend(friendUserName:string):Observable<void>
  {
    return this.http.post<void>(this.serverUrl+"Friend/"+friendUserName, null); 
  }
  public removeFriend(friendUserName:string):Observable<void>
  {
    return this.http.delete<void>(this.serverUrl+"Friend/"+friendUserName); 
  }
  public changePicture(newImg : string):Observable<void>
  {
    return this.http.patch<void>(this.serverUrl+"Picture",newImg);
  }
  public changeUserName(newUserName: UsernameChangeModel):Observable<string>
  {
    return this.http.patch<string>(this.serverUrl+"UserName",newUserName);
  }
  public changeEmail(newEmail: EmailChangeModel):Observable<void>
  {
    return this.http.patch<void>(this.serverUrl+"Email",newEmail);
  }
  public changePassword(newPassword: PasswordChangeModel):Observable<void>
  {
    return this.http.patch<void>(this.serverUrl+"Password",newPassword);
  }
  public getPersonalInfo():Observable<PersonalDetails>
  {
    return this.http.get<PersonalDetails>(this.serverUrl+"User");
  }
}
