import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';

// grids
// easy: 10 x 10 some spaces filled in
// medium: 10 x 10
// hard: 15 x 15
// expert: 20 x 20
// insane: 30 x 30
// godly: 40 x 40

type MenuState = 'initial' | 'play' | 'login' | 'settings';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {
  state: MenuState = 'initial';
  generateBoard = false;

  rows = 0;
  cols = 0;
  pointsFilled = 0;
  desiredPoints = 0;

  constructor (private boardService: BoardService) {}

  private setState(newState: MenuState): void {
    this.state = newState;
  }

  goToState(newState: MenuState): void {
    this.setState(newState);
  }

  onPlay(): void {
    this.setState('play');
  }

  onLogin(): void {
    this.setState('login');
  }

  onSettings(): void {
    this.setState('settings');
  }

  startEasyGame(): void {
    this.boardService.createBoardAndNavigate({
      rows: 10,
      cols: 10,
      desiredPointsPercentage: 0.75
    });
  }

  startMediumGame(): void {
    
  }

  startHardGame(): void {
    
  }

  setEasySettings(): void {
    this.rows = 10;
    this.cols = 10;
    this.pointsFilled = 10;
    this.setCommon();
  }

  setMediumSettings(): void {
    this.rows = 10;
    this.cols = 10;
    this.pointsFilled = 0;
    this.setCommon();
  }

  setHardSettings(): void {
    this.rows = 15;
    this.cols = 15;
    this.pointsFilled = 0;
    this.setCommon();
  }

  setExpertSettings(): void {
    this.rows = 20;
    this.cols = 20;
    this.pointsFilled = 0;
    this.setCommon();
  }

  setInsaneSettings(): void {
    this.rows = 30;
    this.cols = 30;
    this.pointsFilled = 0;
    this.setCommon();
  }

  setCommon(): void {
    this.desiredPoints = this.rows * this.cols * 0.75;
    this.generateBoard = true;
  }

  gameCompleted(): void {
    this.generateBoard = false;
  }
}
