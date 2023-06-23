import { Component, OnInit } from '@angular/core';

// grids
// easy: 5 x 5
// medium: 10 x 10
// hard: 15 x 15
// expert: 20 x 20
// insane: 30 x 30

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  grid: number[][] = [];
  rows: number[][] = [];
  cols: number[][] = [];

  readonly rowCount = 10;
  readonly colCount = 10;
  readonly desiredPoints = 50;

  ngOnInit(): void {
    this.fillNonogramGrid();
    this.setRowAndColumnHeaders();
  }

  private fillNonogramGrid() {
    const grid = [];
    let generatedPoints = 0;

    // Step 2: Create an empty grid
    for (let i = 0; i < this.rowCount; i++) {
      grid[i] = Array(this.colCount).fill(0);
    }

    // Step 4: Fill the grid with random points
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

    console.log(this.rows);
    console.log(this.cols);
  }

  onGridPointClick(x: number, y: number): void {
    if (this.grid[y][x] === 1) {
      
    } else {
      
    }
  }
}
