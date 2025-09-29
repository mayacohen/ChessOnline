import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<any> | null = null;;
  // private socket!: WebSocket;
  
  constructor() {}

  // Explicitly connect with token
  connect(token: string): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket({
        url: `wss://localhost:7070/ws?access_token=${token}`,
        deserializer: msg => JSON.parse(msg.data), // server sends JSON
        serializer: msg => JSON.stringify(msg),   // client sends JSON
         openObserver: {
          next: () => {
              console.log('connetion ok');
          }
      }});
    }
  }

  // Send a message
  sendMessage(message: any): void {
    if (this.socket$) {
      this.socket$.next(message);
    } else {
      console.error('WebSocket not connected.');
    }
  }

  // Receive messages
  getMessages(): Observable<any> {
    if (!this.socket$) {
      throw new Error('WebSocket not connected. Call connect(token) first.');
    }
    return this.socket$.asObservable();
  }

  // Close the connection
  closeConnection(): void {
    this.socket$?.complete();
    this.socket$ = null;
  }
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
