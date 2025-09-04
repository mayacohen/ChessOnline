import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<any>;
  // private socket!: WebSocket;
  constructor() {
    this.socket$ = webSocket('wss://localhost:7070/ws');
  }
  // Send a message to the server
  sendMessage(message: any) {
    this.socket$.next(message);
  }
  // Receive messages from the server
  getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }
  // Close the WebSocket connection
  closeConnection() {
    this.socket$.complete();
  }
  // connect() {
  //   if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
  //     this.sthis.socket$ocket = new WebSocket('ws://localhost:3000');
  //   }
  // }

  // close() {
  //   if (this.socket) {
  //     this.socket.close();
  //   }
  // }
}