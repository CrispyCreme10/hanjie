import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SHA256 } from 'crypto-js';
import { Board } from '../resources/models/board';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiRoutes, environment } from 'src/environment/environment';


export interface BoardOptions {
  rows: number;
  cols: number;
  hits?: number;
  hitsPercentage?: number;
}

export interface BoardRouteData {
  board: Board,
  opts: BoardOptions
}

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  async createBoardAndNavigate(opts: BoardOptions) {
    const board = await this.http
      .post<Board>(`${environment.baseUrl}/${ApiRoutes.Board}`, opts);
    this.router.navigateByUrl('/board', { state: { board: board, opts: opts }});
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
    let desiredPoints = opts.hits ?? 0;
    const dpp = (opts.hitsPercentage ?? 0);
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
