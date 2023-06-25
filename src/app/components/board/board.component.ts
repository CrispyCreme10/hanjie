import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit{
  @ViewChild('bigContainer') bigContainer!: ElementRef;

  @Input() rowCount: number = 0;
  @Input() colCount: number = 0;
  @Input() fillPoints: number = 0;
  @Input() desiredPoints: number = 0;

  @Output() gameCompleted: EventEmitter<any> = new EventEmitter<any>();

  size = 0;
  grid: number[][] = [];
  rows: number[][] = [];
  cols: number[][] = [];
  userGridInitial: number[][] = [];
  userGrid: number[][] = [];
  userGuesses = 0;

  leftDrag = false;
  rightDrag = false;

  lives = 5;

  ngOnInit(): void {
    this.size = this.rowCount * this.colCount;
    this.fillHanjiGrid();
    this.setRowAndColumnHeaders();
    this.setUserGrid();
  }

  ngAfterViewInit(): void {
    this.bigContainer.nativeElement.addEventListener('mousedown', (e: MouseEvent) => {
      if (e.button === 0) {
        this.leftDrag = true;
      } else if (e.button === 2) {
        this.rightDrag = true;
      }
    });
    this.bigContainer.nativeElement.addEventListener('mouseup', (e: MouseEvent) => {
      this.leftDrag = false;
      this.rightDrag = false;
    });
    this.bigContainer.nativeElement.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault());
  }

  private createEmptyGrid(): number[][] {
    const grid: number[][] = [];

    for (let i = 0; i < this.rowCount; i++) {
      grid[i] = Array(this.colCount).fill(0);
    }

    return grid;
  }

  private fillHanjiGrid(): void {
    const grid = this.createEmptyGrid();
    let generatedPoints = 0;

    //Fill the grid with random points
    while (generatedPoints < this.desiredPoints) {
      const randomRow = Math.floor(Math.random() * this.rowCount);
      const randomColumn = Math.floor(Math.random() * this.colCount);

      if (grid[randomRow][randomColumn] === 0) {
        grid[randomRow][randomColumn] = 1;
        generatedPoints++;
      }
    }

    this.grid = grid;
  }

  private setRowAndColumnHeaders(): void {
    // rows
    for (let y = 0; y < this.rowCount; y++) {
      this.rows[y] = [];
      let count = 0;
      for (let x = 0; x < this.colCount; x++) {
        if (this.grid[y][x] === 1) {
          count++;
        } else {
          if (count > 0) {
            this.rows[y].push(count)
            count = 0;
          }
        }
      }
      if (count > 0)
        this.rows[y].push(count)
    }

    // cols
    for (let y = 0; y < this.rowCount; y++) {
      this.cols[y] = [];
      let count = 0;
      for (let x = 0; x < this.colCount; x++) {
        if (this.grid[x][y] === 1) {
          count++;
        } else {
          if (count > 0) {
            this.cols[y].push(count)
            count = 0;
          }
        }
      }
      if (count > 0)
        this.cols[y].push(count)
    }
  }

  private setUserGrid(): void {
    this.userGridInitial = this.createEmptyGrid();
    if (this.fillPoints > 0) {
      this.fillHandicapPoints();
    } else {
      this.resetUserGrid();
    }
  }

  private fillHandicapPoints(): void {
    let filledPoints = 0;

    //Fill the grid with random fill points
    while (filledPoints < this.fillPoints) {
      const randomRow = Math.floor(Math.random() * this.rowCount);
      const randomColumn = Math.floor(Math.random() * this.colCount);

      this.userGridInitial[randomRow][randomColumn] = this.grid[randomRow][randomColumn] === 0 ? -1 : 1;
      filledPoints++;
    }

    this.resetUserGrid();
  }

  private gridPointSelected(mouseButton: 'left' | 'right', x: number, y: number): void {
    if (this.userGrid[y][x] !== 0) {
      return;
    }

    const guessedFill = mouseButton === 'left';
    const guessedX = mouseButton === 'right';

    const gridSlotIsFilled = this.grid[y][x] === 1;

    this.userGrid[y][x] = this.grid[y][x] === 1 ? 1 : -1;

    if (gridSlotIsFilled && guessedX || !gridSlotIsFilled && guessedFill) {
      this.lives--;
    }

    this.userGuesses++;

    if (this.lives <= 0) {
      this.resetBoard();
      return;
    }

    // handle end game
    if (this.userGuesses === this.size) {
      this.gameCompleted.emit();
    }
  }

  private resetBoard(): void {
    this.resetUserGrid();
    this.lives = 5;
  }

  private resetUserGrid(): void {
    this.userGrid = [...this.userGridInitial];
  }

  onGridPointClick(e: MouseEvent, x: number, y: number): void {
    e.preventDefault();

    this.gridPointSelected(e.button === 0 ? 'left' : 'right', x, y);
  }

  onGridGridHover(e: MouseEvent, x: number, y: number): void {
    if (this.leftDrag || this.rightDrag) {
      this.gridPointSelected(this.leftDrag ? 'left' : 'right', x, y);
    }
  }
}
