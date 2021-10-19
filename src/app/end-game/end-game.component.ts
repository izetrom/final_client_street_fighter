import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-end-game',
  templateUrl: './end-game.component.html',
  styleUrls: ['./end-game.component.scss']
})
export class EndGameComponent implements OnInit {
  heroList : any = [];

  constructor(private router: Router, private route: ActivatedRoute, private ws: WebSocketService) { }

  ngOnInit(): void {
    this.ws.sendMessage(JSON.stringify({
      method: 'getHallOfFame',
    }));
    this.ws.onMessage({
      hallOfFame: this.handlehallOfFameResponse.bind(this),
    });
    let tmp = 0;
    this.route.paramMap.subscribe(params => {
    tmp = Number(params.get('winner')) || 0;
    });
    if (tmp == 1)
      this.whowin = "YOU WIN YOU ARE THE BEST OG";
  }
  handlehallOfFameResponse(message : any) : void {
    this.heroList = [];
    message.fameList.forEach((element: {name: string, rank: any}) => {
      this.heroList.push({name: element.name, rank: element.rank});
    });
  }
  whowin: string = "YOU LOOSE HAHA, NOOB!";
  BackToMenu()
  {
    this.router.navigate(['/dashboard']);
  //   var myWindow = window.open("", "_self", "");
  //     myWindow.document.write("");
  // setTimeout (function() {myWindow.close();},1000);
  }
}


