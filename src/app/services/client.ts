import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Client {
  private userName:string = 'guest';
  getUserName()
  {
    return this.userName;
  }
  // get and send user details,
  // chess communication in chess logic?
}
