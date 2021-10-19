import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  formType: string = "login";

  messages: string[] = [];
  username: string = "";
  password: string = "";
  confirmPassword: string = "";

  constructor(private ws: WebSocketService, private router: Router) { }

  ngOnInit(): void {
    this.ws.onMessage({
      login: this.handleAuthResponse.bind(this),
      createAccount: this.handleAuthResponse.bind(this),
    });
  }

  handleAuthResponse(message: any): void {
    if (!message.clientId) return;

    sessionStorage.setItem('clientId', message.clientId)
    sessionStorage.setItem('username', message.username)
    this.router.navigate(['/dashboard']);
  }

  switchForm(formType: string): void {
    this.formType = formType;

    this.username = "";
    this.password = "";
    this.confirmPassword = "";
  }

  submitAuthForm(): void {
    if (this.formType === 'createAccount' && this.password !== this.confirmPassword) return;

    this.ws.sendMessage(JSON.stringify({
      method: this.formType,
      username: this.username,
      password: this.password,
    }));
  }
}
