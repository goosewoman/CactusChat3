import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './shared/components';
import {ServerListComponent} from "./server-list/server-list.component";
import {ChatScreenComponent} from "./chat-screen/chat-screen.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'server-list',
    pathMatch: 'full'
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
