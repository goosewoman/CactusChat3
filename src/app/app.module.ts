import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { ServerListComponent } from './server-list/server-list.component';
import { ChatScreenComponent } from './chat-screen/chat-screen.component';
import { ItemComponent } from './server-list/item/item.component';
import { ModalDirective } from './modal.directive';
import { AddServerScreenComponent } from './add-server-screen/add-server-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import {AddServerModalComponent} from "./modal/add-server-modal/add-server-modal.component";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, ServerListComponent, ChatScreenComponent, ItemComponent, AddServerModalComponent, ModalDirective, AddServerScreenComponent, LoginScreenComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
