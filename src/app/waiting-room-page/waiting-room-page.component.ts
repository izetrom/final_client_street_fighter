import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-waiting-room-page',
  templateUrl: './waiting-room-page.component.html',
  styleUrls: ['./waiting-room-page.component.scss']
})
export class WaitingRoomPageComponent implements OnInit {

  players: any[] = [];
  clientId: string = (sessionStorage.getItem('clientId') || '');
  gameId: string = "";
  indexBackground: string = "";
  sub: any;

  constructor(
    private ws: WebSocketService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.ws.onMessage({
      playerStateChange: this.handlePlayerStateChangeMessage.bind(this),
      startGame: this.handleStartGameMessage.bind(this),
      getRoomInfo: this.handleRoomInfoMessage.bind(this)
    });

    this.sub = this.route.paramMap.subscribe(params => {
      this.gameId = params.get('id') || "";
      this.indexBackground = params.get('index') || "";
    });

    this.ws.sendMessage(JSON.stringify({
      method: 'getRoomInfo',
      gameId: this.gameId,
      clientId: sessionStorage.getItem('clientId')
    }));
  }

  handleRoomInfoMessage(message: any): void {
    this.players = message.players;
  }

  handleStartGameMessage(message: any): void {
    console.log('handlestartgame');
    this.router.navigate(['/room', this.gameId, this.indexBackground]);
  }

  handlePlayerStateChangeMessage(message: any): void {
    let player = this.players.find(p => p.clientId === message.clientId);

    if (player) {
      player.ready = message.ready;
    }
  }

  handlePlayerStateChange(player: any): void {
    this.ws.sendMessage(JSON.stringify({
      method: 'playerStateChange',
      clientId: player.clientId,
      gameId: this.gameId,
      ready: !player.ready
    }));
  }

  handleStartGame(): void {
    this.ws.sendMessage(JSON.stringify({
      method: 'startGame',
      gameId: this.gameId,
    }));
  }

  isAllPlayersReady(): boolean {
    let ready: boolean[] = this.players.map(player => { return player.ready});

    if (ready.length !== 2) return false;

    return ready[0] && ready[1];
  }

}
