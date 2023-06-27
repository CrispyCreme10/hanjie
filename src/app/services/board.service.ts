import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SHA256 } from 'crypto-js';


export interface BoardOptions {
  rows: number;
  cols: number;
  desiredPoints?: number;
  desiredPointsPercentage?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private router: Router) { }

  createBoardAndNavigate(opts: BoardOptions) {
    const board = this.createBoard(opts);
    const id = this.hash(board);
    this.router.navigate(['board', { id: id, board: board, opts: opts }])
  }

  createEmptyBoard(opts: BoardOptions): number[][] {
    const board: number[][] = [];

    for (let i = 0; i < opts.rows; i++) {
      board[i] = Array(opts.cols).fill(0);
    }

    return board;
  }

  createBoard(opts: BoardOptions): number[][] {
    const board = this.createEmptyBoard(opts);
    let generatedPoints = 0;

    //Fill the board with random points
    let desiredPoints = opts.desiredPoints ?? 0;
    const dpp = (opts.desiredPointsPercentage ?? 0);
    if (dpp > 0 && dpp < 1) {
      desiredPoints = opts.rows * opts.cols * dpp;
    }

    while (generatedPoints < desiredPoints) {
      const randomRow = Math.floor(Math.random() * opts.rows);
      const randomColumn = Math.floor(Math.random() * opts.cols);

      if (board[randomRow][randomColumn] === 0) {
        board[randomRow][randomColumn] = 1;
        generatedPoints++;
      }
    }

    return board;
  }

  hash(board: number[][]): string {
    const flatBoard = board.flat().join('');
    return SHA256(flatBoard).toString();
  }
}
