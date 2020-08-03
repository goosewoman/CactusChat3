import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {BotContainerService} from "../bot-container.service";
import {remote} from "electron";
import {Router} from "@angular/router";
import {ChatMessage} from "mineflayer";

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css']
})
export class ChatScreenComponent implements OnInit, AfterViewChecked, OnDestroy {
  private mineflayer: any;
  private ChatMessage: any;

  backlog: string[] = [];
  private motdparser: any;
  private bot: any;
  players: string[] = [];

  constructor(private botContainer: BotContainerService, private router: Router, private changeDetector: ChangeDetectorRef) {
  }

  trackByMessage = (index: number, item: string): string => {
    return `${index} ${item}`;
  };
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  private disconnecting = false;

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  @HostListener('window:beforeunload')
  onBeforeUnload() {
    this.disconnect();
  }

  private disconnect() {
    if (this.bot !== undefined && !this.disconnecting) {
      this.disconnecting = true;
      this.bot.quit("disconnect.quitting");
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (ignored) {
      //
    }
  }

  ngOnInit(): void {
    this.scrollToBottom();
    if (this.botContainer.botData === undefined) {
      this.router.navigate(["/"])
      return;
    }
    this.mineflayer = remote.require("mineflayer");
    this.ChatMessage = this.mineflayer.ChatMessage;

    this.motdparser = remote.require("mcmotdparser")
    this.ChatMessage = remote.require('prismarine-chat')('1.16');

    this.bot = this.mineflayer.createBot(this.botContainer.botData);
    this.bot.on("message", (jsonMsg) => {
      const message = new this.ChatMessage(jsonMsg);
      this.addMessage(message)
    })
    this.bot.once("login", () => {
      this.loadPlayer();
      setInterval(() => this.loadPlayer(), 5000);
    });
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  private addMessage(message: ChatMessage) {
    console.log()
    const date = new Date();
    const timestamp = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] `;
    this.motdparser.toHtml(timestamp + message.toMotd(), (err, res: string) => {

      this.backlog.push(res);
      this.changeDetector.detectChanges(); //because otherwise it doesn't change on its own
      this.scrollToBottom();
    });
  }

  sendChat(event: KeyboardEvent): void {
    const message = (event.target as HTMLInputElement).value;
    (event.target as HTMLInputElement).value = "";
    this.bot.chat(message)
  }

  private loadPlayer() {
    this.players = []
    for (const player of Object.keys(this.bot.players)) {
      if (player.includes('~')) {
        continue;
      }
      this.players.push(player);
    }
    this.changeDetector.detectChanges()
  }
}
