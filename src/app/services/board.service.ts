import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SHA256 } from 'crypto-js';
import { Board } from '../resources/models/board';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiRoutes, environment } from 'src/environment/environment';

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface BoardOptions {
  rows: number;
  cols: number;
  hits?: number;
  hitsPercentage?: number;
}

export interface BoardRouteData {
  cells: number[][],
  opts: BoardOptions,
  handicapPoints: number
}

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  createBoard(opts: BoardOptions): Observable<Board> {
    return this.http.post<Board>(`${environment.baseUrl}/api/${ApiRoutes.Board}`, opts);
  }

  createBoardAndNavigate(opts: BoardOptions, gameDifficulty: GameDifficulty) {
    this.createBoard(opts)
      .subscribe(board => {
        this.router.navigateByUrl(`board/${board.boardId}`, { 
          state: { 
            cells: board.cells, 
            opts: opts,
            handicapPoints: gameDifficulty === 'easy' ? 10 : 0
          }
        });
      });    
  }

  createEmptyBoard(opts: BoardOptions): number[][] {
    const board: number[][] = [];

    for (let i = 0; i < opts.rows; i++) {
      board[i] = Array(opts.cols).fill(0);
    }

    return board;
  }

  createLocalBoard(opts: BoardOptions): number[][] {
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
