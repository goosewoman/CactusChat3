import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BotContainerService {
  botData: { password: string; port: number; chat: string; host: string; version: string; viewDistance: string; username: string };
  constructor() { }
}
