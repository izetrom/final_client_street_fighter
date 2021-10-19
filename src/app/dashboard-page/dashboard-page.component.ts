import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '../services/web-socket.service';
import { Observable, Subject, timer } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})

export class DashboardPageComponent implements OnInit {
  clientId: string = sessionStorage.getItem('clientId') || "";
  gameId: string = "";
  friendName: string = "";
  friends : any = [];
  alive:boolean = false;
  val: number = 0;
  sub!: Observable<number>;

  constructor(private ws: WebSocketService, private router: Router) { }
  ngOnDestroy(): void {
    this.refreshTimer();
  }
  reset$ = new Subject();
  initialize(): void {
    this.sub = this.reset$.pipe(
      startWith(void 0),
      switchMap(() => timer(1000, 1000))
    );
  }
  refreshTimer(): void {
    this.reset$.next(void 0);
  }
  ngOnInit(): void {

    this.ws.sendMessage(JSON.stringify({
      method: 'getFriendList',
      clientId: this.clientId
    }));
    // this.initialize();
    // this.sub.subscribe((val) => {
    //   this.val = val;
    //   if (this.val === 15) {
    //     this.ws.sendMessage(JSON.stringify({
    //       method: 'getFriendList',
    //       clientId: this.clientId
    //     }));
    //     this.refreshTimer();
    //   }
    // });
    this.ws.onMessage({
      createGame: this.handleCreateGameResponse.bind(this),
      joinTrainingGame: this.handleJoinTrainingGameResponse.bind(this),
      join: this.handleJoinGameResponse.bind(this),
      getFriendList: this.handleGetFriendListResponse.bind(this),
      addNewFriend: this.addNewFriendResponse.bind(this),
      removeFriend: this.removeFriendResponse.bind(this),
      getFriendStatus: this.getFriendStatusResponse.bind(this),
      updateFriendList: this.updateFriendListResponse.bind(this),
    });
  }
  updateFriendListResponse(message: any): void {
    this.refreshTimer();
    this.refreshFriends();
  }

  getFriendStatusResponse(message: any) : void {
    this.friends = [];
    message.friendList.forEach((element: { name: string, id:string, state:string, rank:string, isOnGame:string, gameId:string; }) => {
        this.friends.push({name: element.name, id: element.id, state: element.state, rank: element.rank, isOnGame: element.isOnGame, gameId: element.gameId});
    });
  }

  removeFriendResponse(message: any) : void {
    this.friends = [];
    message.friendList.forEach((element: { name: string, id:string, state:string, rank:string, isOnGame:string, gameId:string; }) => {
        this.friends.push({name: element.name, id: element.id, state: element.state, rank: element.rank, isOnGame: element.isOnGame, gameId: element.gameId});
    });
    this.getFriendStatus();
  }

  addNewFriendResponse(message: any) : void {
    this.friends = [];
    message.friendList.forEach((element: { name: string, id:string, state:string, rank:string, isOnGame:string, gameId:string; }) => {
        this.friends.push({name: element.name, id: element.id, state: element.state, rank: element.rank, isOnGame: element.isOnGame, gameId: element.gameId});

    });
    this.getFriendStatus();
  }

  handleGetFriendListResponse(message: any): void {
    this.friends = [];
    message.friendList.forEach((element: { name: string, id:string, state:string, rank:string, isOnGame:string, gameId:string; }) => {
        this.friends.push({name: element.name, id: element.id, state: element.state, rank: element.rank, isOnGame: element.isOnGame, gameId: element.gameId});
    });
    this.getFriendStatus();
  }

  handleCreateGameResponse(message: any): void {
    sessionStorage.setItem('owner', message.owner);
    sessionStorage.setItem('x', message.game.positions.x);
    sessionStorage.setItem('y', message.game.positions.y);
    sessionStorage.setItem('life', message.game.positions.life);
    this.router.navigate(['/waiting-room', message.game.id, message.game.IndexBackground]);
  }

  handleJoinGameResponse(message: any): void {
    console.log(message);
    sessionStorage.setItem('owner', message.owner);
    sessionStorage.setItem('x', message.game.positions.x);
    sessionStorage.setItem('y', message.game.positions.y);
    sessionStorage.setItem('life', message.game.positions.life);
    sessionStorage.setItem('index', message.IndexBackground);
    this.router.navigate(['/waiting-room', message.game.id, message.game.IndexBackground]);
  }

  handleJoinTrainingGameResponse(message: any): void {
    console.log(message);
    sessionStorage.setItem('owner', message.owner);
    sessionStorage.setItem('x', message.game.positions.x);
    sessionStorage.setItem('y', message.game.positions.y);
    sessionStorage.setItem('index', message.IndexBackground);
    this.router.navigate(['/room', message.game.id, message.game.IndexBackground]);
  }
  createGameRoom(): void {
    this.ws.sendMessage(JSON.stringify({
      method: 'createGame',
      clientId: this.clientId
    }));
  }

  createTrainingGameRoom(): void {
    this.ws.sendMessage(JSON.stringify({
      method: 'createTrainingGame',
      clientId: this.clientId,
    }));
  }
  joinGameRoom(): void {
    this.ws.sendMessage(JSON.stringify({
      method: 'join',
      clientId: this.clientId,
      gameId: this.gameId,
    }));
  }

  joinGameFriend(inputGameId: string): void {
    this.ws.sendMessage(JSON.stringify({
      method: 'join',
      clientId: this.clientId,
      gameId: inputGameId,
    }));
  }

  searchFriend(): void {
    console.log ("Search for : " + this.friendName);
    this.ws.sendMessage(JSON.stringify({
      method: 'addNewFriend',
      clientId: this.clientId,
      friendName: this.friendName,
    }));
  }

  refreshFriends(): void {
    this.ws.sendMessage(JSON.stringify({
      method: 'getFriendStatus',
      friendList : this.friends,
    }));
  }
  removeFriend(friendDelete : string): void {
    console.log ("Remove : " + friendDelete);

    this.ws.sendMessage(JSON.stringify({
      method: 'removeFriend',
      clientId: this.clientId,
      friendName: friendDelete,
      friendList : this.friends,
    }));
  }

  getFriendStatus(): void {
    console.log ("send friend ask status");
    this.ws.sendMessage(JSON.stringify({
      method: 'getFriendStatus',
      friendList : this.friends,
    }));
  }

}
