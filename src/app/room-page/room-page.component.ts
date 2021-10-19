import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WebSocketService } from '../services/web-socket.service';
import Phaser from 'phaser';
import * as $ from 'jquery';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
//import { threadId } from 'worker_threads';

const COLOR_PRIMARY = 0x000000;
const COLOR_LIGHT = 0xe9eaec;
const COLOR_DARK = 0x272F49;
const ratio = Math.max(window.innerWidth / window.innerHeight, window.innerHeight / window.innerWidth)
const DEFAULT_HEIGHT = 720 // any height you want
const DEFAULT_WIDTH = ratio * DEFAULT_HEIGHT

export class MainScene extends Phaser.Scene {
  rexUI: any;
  trainingroom: boolean = false;
  constructor(private ws: WebSocketService, private route: ActivatedRoute, private router: Router) {
    super({ key: 'main' });
    var myInt = setInterval(() => {
      this.timer = true;
    }, 30);
    const tmp = sessionStorage.getItem('Position') || { x: 800, y: 500 };
    this.sub = this.route.paramMap.subscribe(params => {
      this.gameId = params.get('id') || "";
      this.IndexBackground = Number(params.get('index')) || 0;
      this.username = sessionStorage.getItem("username") || "";
    });
    if (this.gameId.substring(0, 4) == "trai")
      this.trainingroom = true;
    //const tmpp = this.gameId.substring(0, 4);
    this.ws.onMessage({
      UpdateLife: this.handleLifeUpdate.bind(this),
      UpdatePosition: this.handleUpdatePositionResponse.bind(this),
      sendMessage: this.handleSendMessageResponse.bind(this),
      EndGame: this.HandleEndGame.bind(this),
    });
  }

  HandleEndGame(message: any) {
    let i = 0;
    if (message.looser != this.clientId)
      i = 1;
    this.router.navigate(['/endgame', i]);
    this.scene.stop();
    this.sys.game.destroy(true, false);
  }
  timer: boolean = true;
  username: string = "";
  isChatVisible: boolean = false;
  scrollablePanel: any;
  enterKey: any;
  TKey: any;
  escapeKey: any;
  textInput: any;
  chatMessages: any = [];
  target = new Phaser.Math.Vector2();
  owner: boolean = sessionStorage.getItem('owner') == "true" ? true : false || false;
  sub: any;
  background: any;
  //bar = new Phaser.GameObjects.Graphics(this);
  ken: any;
  opponent: any;
  SpaceBar: any;
  AKey: any;
  ZKey: any;
  ArrowLeft: any;
  life: any = 100;
  opponentLife: any = 100;
  ArrowRight: any;
  ArrowUp: any;
  ArrowDown: any;
  beginningPos: any = sessionStorage.getItem('Position') || { x: 0, y: 0 };
  clientId: string = sessionStorage.getItem('clientId') || "";
  gameId: any;
  leftShadowCap: any;
  middleShaddowCap: any;
  middle: any;
  leftCap: any;
  rightCap: any;
  OpponentleftShadowCap: any;
  OpponentmiddleShaddowCap: any;
  Opponentmiddle: any;
  OpponentleftCap: any;
  OpponentrightCap: any;
  IndexBackground: number = 0;
  FrameNumber = [63, 7, 7, 7, 7, 7, 7, 7, 7, 3, 11, 7, 3, 7, 20, 7, 31, 7, 19, 9, 7, 55, 15, 3, 7, 64,
    7, 6, 3, 3, 55, 7, 7, 7, 7, 6, 7, 3, 15, 15, 7, 7, 7, 7]

  BackgroundsDimensions = [{ width: 708, height: 256 }, { width: 768, height: 237 }, { width: 800, height: 336 },
  { width: 768, height: 368 }, { width: 800, height: 336 }, { width: 752, height: 256 },
  { width: 640, height: 407 }, { width: 752, height: 224 }, { width: 768, height: 384 }, { width: 752, height: 360 },
  { width: 768, height: 384 }, { width: 752, height: 360 }, { width: 768, height: 384 }, { width: 768, height: 368 },
  { width: 752, height: 360 }, { width: 800, height: 336 }, { width: 640, height: 480 },
  { width: 640, height: 322 }, { width: 640, height: 480 }, { width: 768, height: 259 }, { width: 752, height: 224 },
  { width: 624, height: 382 }, { width: 624, height: 396 }, { width: 624, height: 384 }, { width: 625, height: 376 },
  { width: 640, height: 464 }, { width: 623, height: 224 }, { width: 612, height: 224 }, { width: 624, height: 224 },
  { width: 623, height: 224 }, { width: 640, height: 416 }, { width: 640, height: 384 }, { width: 752, height: 224 },
  { width: 752, height: 224 }, { width: 768, height: 256 }, { width: 752, height: 224 },
  { width: 768, height: 241 }, { width: 768, height: 240 }, { width: 768, height: 239 },
  { width: 750, height: 224 }, { width: 740, height: 224 }, { width: 752, height: 224 },
  { width: 752, height: 224 }, { width: 800, height: 336 }, { width: 708, height: 256 }, { width: 708, height: 256 },
  { width: 708, height: 256 },]

  setMeterPercentage(percent = 100, secondpercent = 100) {
    if (percent <= 0)
      percent = 0;
    if (secondpercent <= 0)
      secondpercent = 0;
    const width = 3 * percent;
    const secondwidth = 3 * secondpercent;
    this.middle.displayWidth = width;
    this.rightCap.x = this.middle.x + this.middle.displayWidth;
    this.Opponentmiddle.displayWidth = secondwidth;
    this.OpponentrightCap.x = this.Opponentmiddle.x + this.Opponentmiddle.displayWidth;
  }

  ChooseAnimation(player: any, message: any) {
    if (message.direction == "ArrowRight" || message.direction == "ArrowLeft")
      player.play('walk');
    else if (message.direction == "SpaceBar")
      player.play('hadouken');
    else if (message.direction == "ZKey")
      player.play('kick');
    else if (message.direction = "AKey")
      player.play('punch');
    this.target.x = message.position.x;
    this.target.y = message.position.y;
    player.x = this.target.x;
  }

  TurnPlayer(): void {
    this.ken.flipX = this.ken.x < this.opponent.x ? false : true;
    this.opponent.flipX = this.opponent.x < this.ken.x ? false : true;
  }

  MoveMyPLayer(message: any): void {
    if (this.owner == true)
      this.ChooseAnimation(this.ken, message);
    else if (this.owner == false && this.trainingroom == false)
      this.ChooseAnimation(this.opponent, message);
    if (this.trainingroom == false)
      this.TurnPlayer();

  }

  askServer(direction: string): void {
    if (this.timer == true) {
      this.ws.sendMessage(JSON.stringify({
        method: 'UpdatePosition',
        direction: direction,
        clientId: this.clientId,
        gameId: this.gameId,
      }));
      this.timer = false;
    }
  }

  preload(): void {
    this.load.image('left-cap', 'assets/HealthBar/barHorizontal_green_left.png')
    this.load.image('middle', 'assets/HealthBar/barHorizontal_green_mid.png')
    this.load.image('right-cap', 'assets/HealthBar/barHorizontal_green_right.png')
    this.load.image('left-cap-shadow', 'assets/HealthBar/barHorizontal_shadow_left.png')
    this.load.image('middle-shadow', 'assets/HealthBar/barHorizontal_shadow_mid.png')
    this.load.image('right-cap-shadow', 'assets/HealthBar/barHorizontal_shadow_right.png')
    this.load.spritesheet('background', 'assets/Background/' + this.IndexBackground + '.png',
      { frameWidth: this.BackgroundsDimensions[this.IndexBackground].width, frameHeight: this.BackgroundsDimensions[this.IndexBackground].height });
    this.load.spritesheet('ken', 'assets/ken.png', { frameWidth: 70, frameHeight: 80 });
    this.load.html("form", "assets/form.html");

    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI'
    });

  }

  createHealthBar() {
    const y = 100;
    const x = 50;
    const z = 1550;
    this.leftShadowCap = this.add.image(x, y, 'left-cap-shadow')
      .setOrigin(0, 0.5)
    this.middleShaddowCap = this.add.image(this.leftShadowCap.x + this.leftShadowCap.width, y, 'middle-shadow')
      .setOrigin(0, 0.5)
    this.middleShaddowCap.displayWidth = 300
    this.add.image(this.middleShaddowCap.x + this.middleShaddowCap.displayWidth, y, 'right-cap-shadow')
      .setOrigin(0, 0.5)
    this.leftCap = this.add.image(x, y, 'left-cap')
      .setOrigin(0, 0.5)
    this.middle = this.add.image(this.leftCap.x + this.leftCap.width, y, 'middle')
      .setOrigin(0, 0.5)
    this.rightCap = this.add.image(this.middle.x + this.middle.displayWidth, y, 'right-cap')
      .setOrigin(0, 0.5)

    this.OpponentleftShadowCap = this.add.image(z, y, 'left-cap-shadow')
      .setOrigin(0, 0.5)
    this.OpponentmiddleShaddowCap = this.add.image(this.OpponentleftShadowCap.x + this.OpponentleftShadowCap.width, y, 'middle-shadow')
      .setOrigin(0, 0.5)
    this.OpponentmiddleShaddowCap.displayWidth = 300
    this.add.image(this.OpponentmiddleShaddowCap.x + this.OpponentmiddleShaddowCap.displayWidth, y, 'right-cap-shadow')
      .setOrigin(0, 0.5)
    this.OpponentleftCap = this.add.image(z, y, 'left-cap')
      .setOrigin(0, 0.5)
    this.Opponentmiddle = this.add.image(this.OpponentleftCap.x + this.OpponentleftCap.width, y, 'middle')
      .setOrigin(0, 0.5)
    this.OpponentrightCap = this.add.image(this.Opponentmiddle.x + this.Opponentmiddle.displayWidth, y, 'right-cap')
      .setOrigin(0, 0.5)
    this.setMeterPercentage(100);
  }

  initChat() {
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.enterKey.on("down", () => {
      let chatbox = this.textInput.getChildByName("chat");
      if (chatbox.value != "") {
        this.ws.sendMessage(JSON.stringify({
          method: 'sendMessage',
          message: chatbox.value,
          clientId: this.clientId,
          gameId: this.gameId,
          username: this.username,
        }));
        chatbox.value = "";
      }
    });

    this.TKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
    this.TKey.on("down", () => {
      if (this.isChatVisible === false) {
        this.scrollablePanel.visible = false;
        this.textInput.visible = false;
        this.isChatVisible = true;
      } else {
        this.scrollablePanel.visible = true;
        this.textInput.visible = true;
        this.isChatVisible = false;
      }
    });
    this.textInput = this.add.dom(1320, 120).createFromCache("form").setOrigin(0.5);
    this.scrollablePanel = this.rexUI.add.scrollablePanel({
      x: 960,
      y: 50,
      width: 1000,
      height: 80,
      scrollMode: 0,
      background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY),
      panel: {
        child: this.rexUI.add.fixWidthSizer({
          space: {
            left: 3,
            right: 3,
            top: 3,
            bottom: 3,
            item: 8,
            line: 8,
          }
        }),
        mask: {
          padding: 1
        },
      },
      slider: {
        track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
        thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
      },
      space: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,

        panel: 10,
      }
    }).layout()
    this.updatePanel(this.scrollablePanel, this.chatMessages);
  }
  InitInputKeyboard() {
    this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.ZKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.SpaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PAGE_UP);
    this.ArrowLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.ArrowRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.ArrowUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.ArrowDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }

  initPlayer(player: any, flip: boolean) {
    player = this.add.sprite(this.target.x, this.target.y, 'ken');
    player.setScale(2);
    player.play('idle');
    player.flipX = flip;
    player.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      player.play('idle');
    }, this);
  }
  create(): void {
    //this.DrawHealthBar();
    this.target.x = Number(sessionStorage.getItem('x')) || 0;
    this.target.y = Number(sessionStorage.getItem('y')) + 87 || 0;
    this.InitInputKeyboard();
    // this.add.image(0, 0, 'ken', '__BASE').setOrigin(0, 0);
    // this.add.grid(0, 0, 490, 800, 70, 80).setOrigin(0, 0).setOutlineStyle(0x00ff00);
    this.anims.create({
      key: 'AnimatedBackground',
      frames: this.anims.generateFrameNumbers('background', { start: 0, end: this.FrameNumber[this.IndexBackground] }),
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('ken', { frames: [7, 8, 9, 10] }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'hadouken',
      frames: this.anims.generateFrameNumbers('ken', { frames: [0, 1, 2, 3] }),
      frameRate: 12,
      repeat: 0
    });

    this.anims.create({
      key: 'punch',
      frames: this.anims.generateFrameNumbers('ken', { frames: [14, 15, 16] }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('ken', { frames: [21, 22, 23, 24, 25] }),
      frameRate: 8,
      repeat: 0,
    });

    this.anims.create({
      key: 'kick',
      frames: this.anims.generateFrameNumbers('ken', { frames: [42, 43, 44, 45, 46] }),
      frameRate: 12,
      repeat: 0
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('ken', { frames: [56, 57, 58, 59, 60, 61, 62] }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'stoop',
      frames: this.anims.generateFrameNumbers('ken', { frames: [63] }),
      frameRate: 15,
      repeat: -1
    });

    this.background = this.add.sprite(0, 0, 'background').setOrigin(0).setScale(8);
    this.background.setDisplaySize(window.screen.width, window.screen.height);
    this.background.play('AnimatedBackground');
    if (this.trainingroom == false)
      this.createHealthBar();

    this.ken = this.add.sprite(500, this.target.y, 'ken');
    this.ken.setScale(2);
    this.ken.play('idle');
    this.ken.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.ken.play('idle');
    }, this);
    if (this.trainingroom == false) {
    this.opponent = this.add.sprite(1300, this.target.y, 'ken');
    this.opponent.flipX = true;
    this.opponent.setScale(2);
    this.opponent.play('idle');
    this.opponent.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.opponent.play('idle');
    }, this);
      this.initChat();
    }
    // Create input box


  }

  updatePanel = function (panel: { getElement: (arg0: string) => any; scene: any; layout: () => void; }, content: string) {
    var sizer = panel.getElement('panel');
    var scene = panel.scene;

    sizer.clear(true);
    var lines = content;
    for (var li = 0, lcnt = lines.length; li < lcnt; li++) {
      var words = lines[li].split(' ');
      for (var wi = 0, wcnt = words.length; wi < wcnt; wi++) {
        sizer.add(
          scene.add.text(0, 0, words[wi], {
            fontSize: 18
          })
        );
      }
      if (li < (lcnt - 1)) {
        sizer.addNewLine();
      }
    }
    panel.layout();
    return panel;
  }

  update(): void {
    if (this.AKey.isDown)
      this.askServer("AKey");
    if (this.ZKey.isDown)
      this.askServer("ZKey");
    if (this.SpaceBar.isDown)
      this.askServer("SpaceBar");
    if (this.ArrowLeft.isDown)
      this.askServer("ArrowLeft");
    if (this.ArrowRight.isDown)
      this.askServer("ArrowRight");
    if (this.escapeKey.isDown && this.trainingroom == true) {
      this.router.navigate(['/dashboard']);
      this.scene.stop();
      this.sys.game.destroy(true, false);
    }
  }

  async handleLifeUpdate(message: any): Promise<void> {
    this.owner = message.owner;
    if (this.owner == true && this.trainingroom == false)
      this.life = message.life;
    else if (this.owner == false && this.trainingroom == false)
      this.opponentLife = message.life;
    if (this.trainingroom == false)
      this.setMeterPercentage(this.life, this.opponentLife);
  }

  async handleUpdatePositionResponse(message: any): Promise<void> {
    this.owner = message.owner;
    console.log(message);
    if (this.owner == true && this.trainingroom == false)
      this.life = message.position.life;
    else if (this.trainingroom == false)
      this.opponentLife = message.position.life;
    this.MoveMyPLayer(message);
  }

  handleSendMessageResponse(message: any): void {
    this.chatMessages = [];
    message.game.chat.forEach((element: { username: string, message: string; }) => {
      this.chatMessages.push(element.username + ": " + element.message);
    });
    this.chatMessages.reverse();
    this.updatePanel(this.scrollablePanel, this.chatMessages);
  }
}

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss']
})
export class RoomPageComponent implements OnInit {

  clientId: string = sessionStorage.getItem('clientId') || "";
  gameId: string = "";

  sub: any;

  authorizedKeys: string[] = [
    'ArrowUp',
    'ArrowDown',
    'ArrowRight',
    'ArrowLeft'
  ];

  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor(private ws: WebSocketService, private route: ActivatedRoute, private router: Router) {
    this.config = {
      type: Phaser.AUTO,
      parent: 'app',
      height: window.screen.height,
      width: window.screen.width,
      transparent: false,
      scale: {
        parent: 'gameContainer',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      dom: {
        createContainer: true
      },
      scene: [MainScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 100 }
        }
      }
    };
    this.config.scene = new MainScene(this.ws, this.route, this.router);
    this.phaserGame = new Phaser.Game(this.config);
  }

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(params => {
      this.gameId = params.get('id') || "";
    });
    console.log("game id mec : " + this.gameId);
  }

  HandleEndGame(message: any): void {
    console.log("endgame");
    if (this.phaserGame != undefined)
      this.phaserGame.destroy(true, false);
    else
      console.log("wtf");
    let i = 0;
    if (message.looser)
      this.router.navigate(['/endgame']);
  }

  handleUpdatePositionResponse(message: any): void {
    if (message.direction === "ArrowDown") {
      $(".box").finish().animate({
        top: "+=50"
      });
    }

    if (message.direction === "ArrowUp") {
      $(".box").finish().animate({
        top: "-=50"
      });
    }
    console.log(message);
    if (message.direction === "ArrowRight") {

      $(".box").finish().animate({
        right: "-=50"
      });
    }

    if (message.direction === "ArrowLeft") {
      $(".box").finish().animate({
        right: "+=50"
      });
    }
  }

  handleArrowUpResponse(message: any): void {
    console.log('handleArrowUpResponse');
    console.log(message);

    $(".box").finish().animate({
      top: "-=50"
    });
  }

  handleArrowDownResponse(message: any): void {
    console.log('handleArrowDownResponse');
    console.log(message);

    $(".box").finish().animate({
      top: "+=50"
    });
  }

  handleArrowRightResponse(message: any): void {
    console.log('handleArrowRightResponse');
    console.log(message);

    $(".box").finish().animate({
      right: "-=50"
    });
  }

  handleArrowLeftResponse(message: any): void {
    console.log('handleArrowLeftResponse');
    console.log(message);

    $(".box").finish().animate({
      right: "+=50"
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDownEvent(event: KeyboardEvent) {
    if (!this.authorizedKeys.includes(event.key)) return;

    // this.ws.sendMessage(JSON.stringify({
    //   method: 'UpdatePosition',
    //   direction: event.key,
    //   clientId: this.clientId,
    //   gameId: this.gameId
    // }));
  }

}
