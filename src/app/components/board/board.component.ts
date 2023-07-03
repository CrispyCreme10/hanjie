import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { BoardOptions, BoardRouteData, BoardService } from 'src/app/services/board.service';

type MouseButtonDrag = 'left' | 'right';
type DragDirection = 'up' | 'right' | 'down' | 'left';
type CellDragPosition = 'start' | 'middle' | 'end';
interface CellDragState {
  position: CellDragPosition,
  direction: DragDirection
}

class DragState {
  cellStates = [];
  button!: MouseButtonDrag;
  direction!: DragDirection;

  updateCells(x: number, y: number): CellDragState | null {
    let cell = null;
    try {
      cell = this.cellStates[x][y];
      return null;
    } catch (error) {
      
    }

    // check if valid cell to add
    if (!this.direction) {
      
    }

    // if (this.cellStates?.length === 1) {

    // }
    // // can determine direction after 2nd cell has been chosen

    // let position: CellDragPosition;
    // if (this.cellStates?.length === 1) {
    //   position = 'start';
    // } else if (this.cellStates > 1)
    // return {
    //   position: 
    // };

    return null;
  }
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit {
  @ViewChild('bigContainer') bigContainer!: ElementRef;

  @Output() gameCompleted: EventEmitter<any> = new EventEmitter<any>();

  // styles
  gridBoxSize = 0;
  headerSpacing = 0.85;
  gridSize = 0;

  rowCount: number = 0;
  colCount: number = 0;
  handicapPoints: number = 0;
  desiredPoints: number = 0;
  size = 0;
  adjustedSize = 0; // size after subtracting handicap fill points
  grid: number[][] = [];
  rows: number[][] = [];
  cols: number[][] = [];
  userGridInitial: number[][] = [];
  userGrid: number[][] = [];
  rowFilledMap: Map<number, boolean> = new Map();
  colFilledMap: Map<number, boolean> = new Map();
  autoFill = true; // auto fill rows/cols when there are only non-filled spots left
  rowsFilled = 0;
  colsFilled = 0;

  leftDrag = false;
  rightDrag = false;
  lastClickedX = 0;
  lastClickedY = 0;

  lives = 5;
  lifeLost = false;

  opts!: BoardOptions;
  dragState!: DragState | null;

  isMenuOpen = false;

  faBars = faBars;

  constructor(
    private boardService: BoardService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const {cells, opts, handicapPoints} = this.router.getCurrentNavigation()?.extras.state as BoardRouteData;
    this.rowCount = opts.rows;
    this.colCount = opts.cols;

    this.grid = cells;
    this.opts = opts;
    this.handicapPoints = handicapPoints;
  }

  ngOnInit(): void {
    this.getBoardData();

    // styles
    this.setGridBoxSize();
    this.gridSize = this.gridBoxSize * this.rowCount;

    this.size = this.rowCount * this.colCount;
    this.adjustedSize = this.size - this.handicapPoints;
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

      // initialize DragState
      this.dragState = new DragState();
      this.dragState.button = this.leftDrag ? 'left' : 'right';
    });
    this.bigContainer.nativeElement.addEventListener('mouseup', (e: MouseEvent) => {
      this.leftDrag = false;
      this.rightDrag = false;

      // apply DragState
      // clear DragState
      this.dragState = null;
    });
    this.bigContainer.nativeElement.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault());
  }

  private getBoardData(): void {
    const id = this.route.snapshot.paramMap.get("id");
    console.log(id);
  }

  private setGridBoxSize(): void {
    if (this.rowCount <= 15) {
      this.gridBoxSize = 40;
      return;
    } else if (this.rowCount <= 20) {
      this.gridBoxSize = 30;
      return;
    }

    this.gridBoxSize = 20;
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
    this.userGridInitial = this.boardService.createEmptyBoard(this.opts);
    if (this.handicapPoints > 0) {
      this.fillHandicapPoints();
    } else {
      this.resetUserGrid();
    }
  }

  private fillHandicapPoints(): void {
    let filledPoints = 0;

    //Fill the grid with random fill points
    while (filledPoints < this.handicapPoints) {
      const randomRow = Math.floor(Math.random() * this.rowCount);
      const randomColumn = Math.floor(Math.random() * this.colCount);

      this.userGridInitial[randomRow][randomColumn] = this.grid[randomRow][randomColumn] === 0 ? -1 : 1;
      filledPoints++;
    }

    this.resetUserGrid();
  }

  private gridPointSelected(mouseButton: MouseButtonDrag, x: number, y: number): void {
    // don't do anything if they click a square that is already filled
    if (this.userGrid[y][x] !== 0) {
      return;
    }

    // setup
    const guessedFill = mouseButton === 'left';
    const guessedX = mouseButton === 'right';
    const gridSlotIsFilled = this.grid[y][x] === 1;

    // set user grid point value
    this.setUserGridFromMaster(x, y);

    // check if there are only non-filled spots left in row or col
    if (this.autoFill) {
      if (this.isRowOnlyNonFilled(y)) {
        // set all row non-filled in user grid
        this.setUserRowNonFilled(y);
      }
  
      if (this.isColOnlyNonFilled(x)) {
        // set all col non-filled in user grid
        this.setUserColNonFilled(x);
      }
    }

    // check if row or col has been completed
    if (this.isRowFilled(y)) {
      this.rowFilledMap.set(y, true);
      this.rowsFilled++;
    }
    
    if (this.isColFilled(x)) {
      this.colFilledMap.set(x, true);
      this.colsFilled++;
    }

    // subtract lives if incorrect choice
    if (gridSlotIsFilled && guessedX || !gridSlotIsFilled && guessedFill) {
      this.lives--;
      this.lifeLost = true;
    }

    // reset board if they lost all of their lives
    if (this.lives <= 0) {
      this.resetBoard();
      return;
    }

    // handle end of winning game
    if (this.rowsFilled === this.rowCount && this.colsFilled === this.colCount) {
      this.gameCompleted.emit();
    }
  }

  private isRowFilled(y: number): boolean {
    // values are 1 or -1 if filled, so a 0 in any position of the row would indicate a non-filled row
    return this.userGrid[y].every(val => val !== 0);
  }

  private isColFilled(x: number): boolean {
    // iterate over all col values...after we find a 0, then this col is non-filled
    for (let i = 0; i < this.rowCount; i++) {
      if (this.userGrid[i][x] === 0) {
        return false;
      }
    }

    return true;
  }

  private isRowOnlyNonFilled(y: number): boolean {
    for (let i = 0; i < this.rowCount; i++) {
      if (this.userGrid[y][i] === 0 && this.grid[y][i] === 1) {
        return false;
      }
    }

    return true;
  }

  private isColOnlyNonFilled(x: number): boolean {
    for (let i = 0; i < this.colCount; i++) {
      if (this.userGrid[i][x] === 0 && this.grid[i][x] === 1) {
        return false;
      }
    }

    return true;
  }

  private setUserRowNonFilled(y: number): void {
    for (let x = 0; x < this.rowCount; x++) {
      this.setUserGridFromMaster(x, y);
    }
  }

  private setUserColNonFilled(x: number): void {
    for (let y = 0; y < this.colCount; y++) {
      this.setUserGridFromMaster(x, y);
    }
  }

  private setUserGridFromMaster(x: number, y: number): void {
    this.userGrid[y][x] = this.grid[y][x] === 1 ? 1 : -1;
  }

  private resetBoard(): void {
    this.lives = 5;
    this.leftDrag = false;
    this.rightDrag = false;
    this.resetUserGrid();
    this.resetRowMap();
    this.resetColMap();
  }

  private resetUserGrid(): void {
    this.userGrid = this.boardService.createEmptyBoard(this.opts);
    for(let x = 0; x < this.rowCount; x++) {
      for (let y = 0; y < this.colCount; y++) {
        this.userGrid[x][y] = this.userGridInitial[x][y];
      }
    }
  }

  private resetRowMap(): void {
    this.rowFilledMap.clear();
    for (let i = 0; i < this.rowCount; i++) {
      this.rowFilledMap.set(i, false);
    }
  }

  private resetColMap(): void {
    this.colFilledMap.clear();
    for (let i = 0; i < this.colCount; i++) {
      this.colFilledMap.set(i, false);
    }
  }

  onGridPointClick(e: MouseEvent, x: number, y: number): void {
    e.preventDefault();
    console.log('onGridPointClick');
    this.lastClickedX = x;
    this.lastClickedY = y;
    this.gridPointSelected(e.button === 0 ? 'left' : 'right', x, y);
  }

  onGridPointHover(e: MouseEvent, x: number, y: number): void {
    // this func gets called every time onGridPointClick is called...so we must negate this call if it was a click and not just a drag (mousedown) event
    if (this.lastClickedX === x && this.lastClickedY === y) {
      return;
    }

    if (this.leftDrag || this.rightDrag && this.dragState) {
      // old logic...may still use eventually
      // this.gridPointSelected(this.leftDrag ? 'left' : 'right', x, y);

      const added = this.dragState?.updateCells(x, y);
      if (added) {
        // apply styles
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
