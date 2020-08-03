import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {McServer} from "../mc.server";
import {ModalDirective} from "../modal.directive";
import {LoginEvent, LoginModalComponent} from "../modal/login-modal/login-modal.component";
// import * as mf from 'mineflayer'
import {remote} from "electron";
import {BotContainerService} from "../bot-container.service";
import {Router} from "@angular/router";

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

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private botManager: BotContainerService, private router: Router) {
    this.mineflayer = remote.require("mineflayer");
    this.mcprotocol = remote.require("minecraft-protocol");
    this.ChatMessage = remote.require('prismarine-chat')('1.16');

    this.motdparser = remote.require("mcmotdparser")
  }

  ngOnInit(): void {
  }

  private isLoggingIn = false;

  LogIn(server: McServer): void {
    if (this.isLoggingIn) {
      return;
    }
    this.isLoggingIn = true;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(LoginModalComponent)
    const viewContainerRef = this.modalHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    componentRef.instance.server = server;
    componentRef.instance.closeModalEvent.subscribe(() => {
      this.isLoggingIn = false;
      componentRef.destroy();
      viewContainerRef.clear()
    });
    componentRef.instance.loginEvent.subscribe((data: LoginEvent) => {
      const host = data.server.host;
      const port = data.server.port;
      const email = data.email;
      const password = data.password;
      this.botManager.botData = {
        host: host,
        password: password,
        port: port,
        username: email,
        version: data.server.version,
        viewDistance: "tiny",
        chat: "enabled"
      };
      this.router.navigate(["/chat-screen"]).then(r => r)
    })
  }
}
