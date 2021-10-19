import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {

  message: string = "";
  clientId: number = 0;
  gameid: number = 1;

  messageHistory: any[] = [
    { username: 'Limint', text: 'Premier message' },
    { username: 'Manshow', text: 'Deuxieme message' },
    { username: 'Limint', text: 'Troisieme message' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  sendChatMessage(): void {
  }

}
