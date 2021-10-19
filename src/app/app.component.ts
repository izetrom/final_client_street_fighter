import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { WebSocketService } from './services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [WebSocketService],
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  messageFromServer!: string;
  wsSubscription!: Subscription;
  status: string = "";

  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    this.wsSubscription =
      this.wsService.createObservableSocket("ws://street-fighter-is-back.herokuapp.com/")
       .subscribe(
        data => this.messageFromServer = data,
         err => console.log( 'err'),
        () =>  console.log( 'The observable stream is complete')
      );

      this.wsService.onMessage({
        connect: this.handleConnectResponse,
      });
  }

  handleConnectResponse(message: any): void {
    console.log('front is connected to back');
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
