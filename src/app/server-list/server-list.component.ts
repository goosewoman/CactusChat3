import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {McServer} from "../mc.server";
import {ModalDirective} from "../modal.directive";
// import * as mf from 'mineflayer'
import {remote} from "electron";
import {BotContainerService} from "../bot-container.service";
import {Router} from "@angular/router";
import * as ElectronStore from "electron-store";
import {AddServerModalComponent, SubmitEvent} from "../modal/add-server-modal/add-server-modal.component";

@Component({
  selector: 'app-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.css']
})
export class ServerListComponent implements OnInit {

  @ViewChild(ModalDirective, {static: true}) modalHost: ModalDirective;
  private mineflayer: any;
  private motdparser: any;
  private ChatMessage: any;
  private mcprotocol: any;
  private store: ElectronStore;
  servers: McServer[] = [];

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private botManager: BotContainerService, private router: Router) {
    this.mineflayer = remote.require("mineflayer");
    this.mcprotocol = remote.require("minecraft-protocol");
    this.ChatMessage = remote.require('prismarine-chat')('1.16');

    this.motdparser = remote.require("mcmotdparser")
  }

  ngOnInit(): void {
    const ElectronStore = require("electron-store");
    this.store = new ElectronStore();
    this.loadServers()
  }

  private isLoggingIn = false;

  getUsername(): string {
    return this.botManager.selectedProfile.name;
  }

  LogIn(obj: { server: McServer, index: number }): void {
    if (this.isLoggingIn) {
      return;
    }
    this.isLoggingIn = true;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AddServerModalComponent);
    const viewContainerRef = this.modalHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<AddServerModalComponent>(componentFactory);
    componentRef.instance.server = obj.server;
    componentRef.instance.closeModalEvent.subscribe(() => {
      componentRef.destroy()
      this.isLoggingIn = false;
    })
    componentRef.instance.submitEvent.subscribe((event: SubmitEvent) => {
      console.log(JSON.stringify(event.server))
      if (event.server === undefined) {
        this.servers.splice(obj.index, 1)
        this.saveServers();
        componentRef.destroy();
        this.isLoggingIn = false
        return;
      }
      this.servers[obj.index] = event.server
      this.saveServers();
      this.botManager.botData = {
        host: obj.server.host,
        port: obj.server.port,
        version: obj.server.version,
        viewDistance: "tiny",
        chat: "enabled"
      };
      this.router.navigate(["/chat-screen"]).then(r => r)
      componentRef.destroy();
      this.isLoggingIn = false

    })


  }

  onClickAddServerButton(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AddServerModalComponent);
    const viewContainerRef = this.modalHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<AddServerModalComponent>(componentFactory);
    componentRef.instance.closeModalEvent.subscribe(() => {
      componentRef.destroy()
    })
    componentRef.instance.submitEvent.subscribe((event: SubmitEvent) => {
      console.log(JSON.stringify(event.server))
      this.servers.push(event.server);
      this.saveServers();
      componentRef.destroy();
    })
  }

  onClickLogoutButton(): void {
    this.store.delete("clientToken");
    this.store.delete("accessToken");
    this.store.delete("username");
    this.store.delete("userID");
    this.router.navigate(["/"])
  }

  private saveServers() {
    console.log(JSON.stringify(this.servers));
    this.store.set("servers", JSON.stringify(this.servers))
  }

  private loadServers() {
    this.servers = JSON.parse(this.store.get("servers", '[]').toString());
    console.log(this.store.get("servers"))
  }
}
