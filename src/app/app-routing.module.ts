import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './shared/components';
import {MainScreenComponent} from "./main-screen/main-screen.component";


const routes: Routes = [
  {
    path: '',
    redirectTo: 'main-screen',
    pathMatch: 'full'
  },
  {
    path: 'main-screen',
    component: MainScreenComponent
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
