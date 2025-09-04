import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReturnTokensModel } from '../models/return-tokens-model';
import { SignUpModel } from '../models/sign-up-model';
@Injectable({
  providedIn: 'root'
})
export class Client {
  private http = inject(HttpClient);
  private userName:string = 'guest';
  getUserName()
  {
    return this.userName;
  }
  getLoggedInStatus()
  {
    return true;
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
   
  // get and send user details,
  // chess communication in chess logic?
}
