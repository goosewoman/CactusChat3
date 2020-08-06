import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {McServer} from "../../mc.server";
import {ElectronService} from "../../core/services";

@Component({
  selector: 'app-server-list-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input() server: McServer;
  @Output() onClickServer: EventEmitter<any> = new EventEmitter()
  serverIcon = "";
  players: number;
  maxPlayers: number;
  motd: string;
  private mc: any;
  latency: any;
  private ChatMessage: any;
  private motdparser: any;
  version: string;
  @Input() index: number;

  constructor(private electron: ElectronService, private changeDetector: ChangeDetectorRef) {
    this.mc = electron.remote.require("minecraft-protocol");
    this.ChatMessage = electron.remote.require('prismarine-chat')('1.16');
    this.motdparser = electron.remote.require("mcmotdparser")

  }

  ngOnInit(): void {
    this.StartPing()
  }

  private StartPing() {
    console.log("startping");
    console.log(this.server)
    this.mc.ping({
      host: this.server.host,
      port: this.server.port,
      majorVersion: this.server.version
    }, (error, result) => {
      if (result === undefined) {
        console.log(error);
        return;
      }
      console.log(result);
      if ('players' in result) {
        this.players = result.players.online;
        this.maxPlayers = result.players.max;
        this.serverIcon = result.favicon;
        this.version = result.version.name;
        const message = new this.ChatMessage(result.description);
        this.latency = result.latency;
        this.motdparser.toHtml(message.toMotd(), (err, res) => {
          this.motd = res;
          this.changeDetector.detectChanges(); //because otherwise it doesn't change on its own
        });
      }
    });
  }

  onClick(): void {
    this.onClickServer.emit({server: this.server, index: this.index})
  }
}
