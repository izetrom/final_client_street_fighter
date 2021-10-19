import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { EndGameComponent } from './end-game/end-game.component';

import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { RoomPageComponent } from './room-page/room-page.component';
import { WaitingRoomPageComponent } from './waiting-room-page/waiting-room-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomePageComponent
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent
  },
  {
    path: 'waiting-room/:id/:index',
    component: WaitingRoomPageComponent
  },
  {
    path: 'room/:id/:index',
    component: RoomPageComponent
  },
  {
    path: 'endgame/:winner',
    component: EndGameComponent
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
