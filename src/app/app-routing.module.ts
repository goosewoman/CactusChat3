import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './shared/components';
import {ServerListComponent} from "./server-list/server-list.component";
import {ChatScreenComponent} from "./chat-screen/chat-screen.component";
import {LoginScreenComponent} from "./login-screen/login-screen.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login-screen',
    pathMatch: 'full'
  },
  {
    path: 'login-screen',
    component: LoginScreenComponent
  },
  {
    path: 'server-list',
    component: ServerListComponent
  },
  {
    path: 'chat-screen',
    component: ChatScreenComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
