import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {McServer} from "../../mc.server";

export interface LoginEvent {
  server: McServer;
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-modal',
  templateUrl: './add-server-modal.component.html',
  styleUrls: ['./add-server-modal.component.css']
})
export class AddServerModalComponent implements OnInit {

  @Output() loginEvent: EventEmitter<LoginEvent> = new EventEmitter<LoginEvent>();
  @Output() closeModalEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() server: McServer
  @ViewChild("passwordInput") passwordInput;
  @ViewChild("emailInput") emailInput;

  constructor() {
  }

  ngOnInit(): void {
  }

  private hasSubmit = false;

  OnSubmit(): void {
    if (!this.hasSubmit) {
      this.hasSubmit = true;
      const server = this.server;
      const email = this.emailInput.nativeElement.value;
      const password = this.passwordInput.nativeElement.value;
      this.loginEvent.emit({server, email, password});
    }
  }

  OnClose(): void {
    this.closeModalEvent.emit();

  }
}
