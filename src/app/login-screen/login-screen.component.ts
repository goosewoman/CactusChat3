import {ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {remote} from "electron";
import * as ElectronStore from "electron-store";
import {BotContainerService} from "../bot-container.service";
import {Router} from "@angular/router";
import {compareNumbers} from "@angular/compiler-cli/src/diagnostics/typescript_version";

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent implements OnInit {

  @ViewChild("passwordInput") passwordInput;
  @ViewChild("emailInput") emailInput;
  // @ViewChild("checkbox") checkbox;
  private store: ElectronStore
  hasError = false;
  errorMessage: string;
  private submitting = false;
  private firstSubmit = true;
  private https: any;

  constructor(private changeDetector: ChangeDetectorRef, private botContainerService: BotContainerService, private router: Router, private ngZone: NgZone) {
  }

  ngOnInit(): void {
    const ElectronStore = require("electron-store");
    this.store = new ElectronStore();
    this.https = remote.require('https');
    // if (this.store.has("clientToken") && this.store.has("accessToken")) {
    //   this.botContainerService.clientToken = this.store.get("clientToken").toString();
    //   this.botContainerService.accessToken = this.store.get("accessToken").toString();
    //   const data = JSON.stringify({
    //     agent: {
    //       name: "Minecraft",
    //       version: 1
    //     },
    //   });
    //
    //   const options = {
    //     hostname: 'authserver.mojang.com',
    //     port: 443,
    //     path: '/validate',
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   }
    //
    //   const req = this.https.request(options, (res) => {
    //     res.on('data', (data) => {
    //       data = JSON.parse((data.toString()));
    //
    //       const accessToken = data.accessToken;
    //       const clientToken = data.clientToken;
    //       this.botContainerService.accessToken = accessToken;
    //       this.botContainerService.clientToken = clientToken;
    //       this.botContainerService.selectedProfile = data.selectedProfile;
    //       this.store.set("clientToken", clientToken);
    //       if (this.checkbox.nativeElement.checked) {
    //         this.store.set("accessToken", accessToken);
    //         this.store.set("username", data.selectedProfile.name);
    //         this.store.set("userID", data.selectedProfile.id);
    //       }
    //       this.ngZone.run(() => {
    //         this.router.navigate(['/server-list'])
    //       })
    //     })
    //   });
    //
    //
    //   req.write(data, (err) => {
    //     if (err !== undefined) {
    //       console.info(err);
    //     }
    //   });
    //   req.end()
    //   this.botContainerService.selectedProfile = {
    //     name: this.store.get("username").toString(),
    //     id: this.store.get('userID').toString()
    //   };
    //   this.router.navigate(["/server-list"])
    // }

  }

  OnSubmit(): void {
    if (this.submitting) {
      return;
    }
    this.submitting = true;

    const data = JSON.stringify({
      username: this.emailInput.nativeElement.value,
      password: this.passwordInput.nativeElement.value,
      agent: {
        name: "Minecraft",
        version: 1
      },
    });

    const options = {
      hostname: 'authserver.mojang.com',
      port: 443,
      path: '/authenticate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const req = this.https.request(options, (res) => {
      res.on('data', (data) => {
        data = JSON.parse((data.toString()));
        if (data.error !== undefined) {
          this.hasError = true;
          this.errorMessage = data.errorMessage;
          this.changeDetector.detectChanges()
        } else {
          const accessToken = data.accessToken;
          const clientToken = data.clientToken;
          this.botContainerService.accessToken = accessToken;
          this.botContainerService.clientToken = clientToken;
          this.botContainerService.selectedProfile = data.selectedProfile;
          // if (this.checkbox.nativeElement.checked) {
          //   this.store.set("accessToken", accessToken);
          //   this.store.set("clientToken", clientToken);
          //   this.store.set("username", data.selectedProfile.name);
          //   this.store.set("userID", data.selectedProfile.id);
          // }
          this.ngZone.run(() => {
            this.router.navigate(['/server-list'])
          })
        }
        this.submitting = false;
      });
    });
    req.on('error', (e) => {
      console.error(e);
    });

    req.write(data, (err) => {
      if (err !== undefined) {
        console.info(err);
      }
    });
    req.end()

  }
}