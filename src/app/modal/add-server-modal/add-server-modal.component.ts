import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {McServer} from "../../mc.server";

export interface SubmitEvent {
  server: McServer;
}

@Component({
  selector: 'app-login-modal',
  templateUrl: './add-server-modal.component.html',
  styleUrls: ['./add-server-modal.component.css']
})
export class AddServerModalComponent implements OnInit {

  @Output() submitEvent: EventEmitter<SubmitEvent> = new EventEmitter<SubmitEvent>();
  @Output() closeModalEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("versionSelect") versionSelect;
  @ViewChild("hostInput") hostInput;
  @ViewChild("portInput") portInput;
  @ViewChild("nameInput") nameInput;

  server: McServer;
  versions = ['1.9', '1.9.1', '1.9.2', '1.9.3', '1.9.4', '1.10', '1.10.1', '1.10.2', '1.11', '1.11.1', '1.11.2', '1.12', '1.12.1', '1.12.2', '1.13', '1.13.1', '1.13.2', '1.14', '1.14.1', '1.14.2', '1.14.3', '1.14.4', '1.15', '1.15.1', '1.15.2', '1.16', '1.16.1']

  constructor() {
  }

  ngOnInit(): void {
  }

  private hasSubmit = false;

  OnSubmit(): void {
    if (!this.hasSubmit) {
      this.hasSubmit = true;
      const select = this.versionSelect.nativeElement;

      const server = {
        name: this.nameInput.nativeElement.value,
        host: this.hostInput.nativeElement.value,
        port: this.portInput.nativeElement.value,
        version: select.options[select.selectedIndex].value,
      }
      this.submitEvent.emit({server});
    }
  }

  OnClose(): void {
    this.closeModalEvent.emit();

  }

  OnDelete(): void {
    this.submitEvent.emit({server: undefined})
  }
}
