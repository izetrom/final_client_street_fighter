import {Observable } from 'rxjs';

export class WebSocketService {

  ws!: WebSocket;
  socketIsOpen = 1;
  msgQueue: string[] = [];

  createObservableSocket(url: string): Observable<any> {
     this.ws = new WebSocket(url);

    return new Observable(
       observer => {

        this.ws.onmessage = (event) =>
          observer.next(event.data);

        this.ws.onerror = (event) => observer.error(event);

        this.ws.onclose = (event) => observer.complete();

        return () =>
            this.ws.close(1000, "The user disconnected");
       }
    );
  }

  sendMessage(message: string): string {
    if (this.ws.readyState === this.socketIsOpen) {
       this.ws.send(message);
       return `Sent to server ${message}`;
    } else {
      return 'Message was not sent - the socket is closed';
     }
  }

  // sendMessage(message: Object): boolean {
  //   if (this.ws.readyState !== this.socketIsOpen) return false;

  //   this.ws.send(JSON.stringify(message));
  //   return true;
  // }

  getMessage() : string {
    var returnMessage = "";
    this.ws.onmessage = function(message) {
      returnMessage = JSON.parse(message.data);
      return (returnMessage);
    }
    return returnMessage;
  }

  onMessage(messageHandlers: any): void {
    this.ws.onmessage = function(message: any) {
      let parsedMessage = JSON.parse(message.data);

      console.log(parsedMessage);

      if (parsedMessage.method === 'error')
        console.log(parsedMessage.message);

      if (messageHandlers[parsedMessage.method])
        messageHandlers[parsedMessage.method](parsedMessage);
    }
  }
}


// import { Injectable } from '@angular/core';
// import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
// import { Observable } from 'rxjs';
// import { environment as env } from '../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class SocketService {

//   connection$: WebSocketSubject<any>;

//   constructor() { }

//   connect(): Observable<any> {
//     this.connection$ = webSocket(`${env.socket_endpoint}/angularuser`);
//     return this.connection$;
//   }

//   send(data: any): void {
//     if (this.connection$) {
//       this.connection$.next(data);
//     } else {
//       console.log('Did not send data, unable to open connection');
//     }
//   }

//   closeConnection(): void {
//     if (this.connection$) {
//       this.connection$.complete();
//       this.connection$= null;
//     }
//   }

//   ngOnDestroy() {
//     this.closeConnection();
//   }

// }
