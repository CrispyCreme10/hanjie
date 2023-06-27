import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { BoardComponent } from './components/board/board.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/main-menu' },
  { path: 'main-menu', component: MainMenuComponent },
  { path: 'board/:id', component: BoardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
