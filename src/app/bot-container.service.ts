import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BotContainerService {
  botData: any

  accessToken: string;
  clientToken: string;
  selectedProfile: { id: string; name: string }


  constructor() {
  }
}
