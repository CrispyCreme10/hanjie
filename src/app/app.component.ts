import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

// grids
// easy: 10 x 10 some spaces filled in
// medium: 10 x 10
// hard: 15 x 15
// expert: 20 x 20
// insane: 30 x 30

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  generateBoard = false;

  rows = 0;
  cols = 0;
  pointsFilled = 0;
  desiredPoints = 0;

  setEasySettings(): void {
    this.rows = 10;
    this.cols = 10;
    this.pointsFilled = 10;
    this.desiredPoints = 10 * 10 * 0.75;
    this.generateBoard = true;
  }

  setMediumSettings(): void {
    this.rows = 10;
    this.cols = 10;
    this.pointsFilled = 0;
    this.desiredPoints = 10 * 10 * 0.75;
    this.generateBoard = true;
  }

  setHardSettings(): void {
    this.rows = 15;
    this.cols = 15;
    this.pointsFilled = 0;
    this.desiredPoints = 15 * 15 * 0.75;
    this.generateBoard = true;
  }

  setExpertSettings(): void {
    this.rows = 20;
    this.cols = 20;
    this.pointsFilled = 0;
    this.desiredPoints = 20 * 20 * 0.75;
    this.generateBoard = true;
  }

  setInsaneSettings(): void {
    this.rows = 30;
    this.cols = 30;
    this.pointsFilled = 0;
    this.desiredPoints = 30 * 30 * 0.75;
    this.generateBoard = true;
  }

  gameCompleted(): void {
    this.generateBoard = false;
  }
}
