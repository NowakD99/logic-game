import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  player1 = {
    isActive: true,
    color: 'red',
    name: 'player1'
  };
  player2 = {
    isActive: false,
    color: 'blue',
    name: 'player2'
  };
  winner = {
    name: null,
    color: null
  };
  activeGame = true;
  table = [];
  tableMoves = [];
  numbers = 0;

  ngOnInit() {
    this.initBoard();
  }
  changePlayer() {
    this.player1.isActive = !this.player1.isActive;
    this.player2.isActive = !this.player2.isActive;
  }
  victory(player) {
    console.log(player);
    console.log('win');
    this.winner = {
      name: player.name,
      color: player.color
    };
    this.activeGame = false;
  }
  initBoard() {
    for (let i = 0; i < 4; i++) {
      this.table[i] = [];
      for (let j = 0; j < 4; j++) {
        this.table[i][j] = [];
        for (let k = 0; k < 4; k++) {
          this.table[i][j][k] = {
            z: i,
            y: j,
            x: k,
            isEmpty: true,
            color: null,
            isWonField: false
          };
        }
      }
    }
  }
  undo() {
    if (this.numbers) {
      const field = this.tableMoves[this.tableMoves.length - 1];
      if (this.table[field.z][field.y][field.x].isWonField) {
        this.winner = {
          name: null,
          color: null
        };
        this.activeGame = true;
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
              this.table[i][j][k].isWonField = false;
            }
          }
        }
      }
      this.table[field.z][field.y][field.x].isEmpty = true;
      this.table[field.z][field.y][field.x].color = null;
      this.numbers--;
      this.tableMoves.splice(-1, 1);
      this.changePlayer();
    }
  }
  resetGame() {
    this.initBoard();
    this.numbers = 0;
    this.player1.isActive = true;
    this.player2.isActive = false;
    this.tableMoves = [];
    this.winner = {
      name: null,
      color: null
    };
    this.activeGame = true;
  }
  checkWin(xPosition, yPosition, zPosition, player) {
    const x = parseInt(xPosition, 10);
    const y = parseInt(yPosition, 10);
    const z = parseInt(zPosition, 10);
    const color = player.color;
    this.checkWinInLine(x, y, z, color, { x: 1, y: 0, z: 0 }, player);
    this.checkWinInLine(x, y, z, color, { x: 0, y: 1, z: 0 }, player);
    this.checkWinInLine(x, y, z, color, { x: 0, y: 0, z: 1 }, player);
    if (!(((x === 1 || x === 2) && (y === 1 || y === 2))
    || ((x === 1 || x === 2) && (z === 1 || z === 2))
    || ((y === 1 || y === 2) && (z === 1 || z === 2)))) {
      if ((x + y + z) % 3 === 0) {
        this.checkWinInLine(x, y, z, color, { x: x === 0 ? 1 : -1, y: y === 0 ? 1 : -1, z: z === 0 ? 1 : -1}, player);
        this.checkWinInLine(x, y, z, color, { x: 0, y: y === 0 ? 1 : -1, z: z === 0 ? 1 : -1}, player);
        this.checkWinInLine(x, y, z, color, { x: x === 0 ? 1 : -1, y: 0, z: z === 0 ? 1 : -1}, player);
        this.checkWinInLine(x, y, z, color, { x: x === 0 ? 1 : -1, y: y === 0 ? 1 : -1, z: 0}, player);
      } else {
        if ((z === 0 || z === 3) && (y === 1 || y === 2)) {
          this.checkWinInLine(x, y, z, color, { x: x === 0 ? 1 : -1, y: 0, z: z === 0 ? 1 : -1}, player);
        } else if ((y === 0 || y === 3) && (x === 1 || x === 2)) {
          this.checkWinInLine(x, y, z, color, { x: 0, y: y === 0 ? 1 : -1, z: z === 0 ? 1 : -1}, player);
        } else if ((x === 0 || x === 3) && (z === 1 || z === 2)) {
          this.checkWinInLine(x, y, z, color, { x: x === 0 ? 1 : -1, y: y === 0 ? 1 : -1, z: 0}, player);
        }
      }
    } else {
      if ((x === 1 && y === 1 && z === 1) || (x === 2 && y === 2 && z === 2)) {
        this.checkWinInLine(x, y, z, color, { x: 1, y: 1, z: 1}, player);
        this.checkWinInLine(x, y, z, color, { x: 1, y: 0, z: 1}, player);
        this.checkWinInLine(x, y, z, color, { x: 0, y: 1, z: 1}, player);
      } else if ((x === 2 && y === 1 && z === 1) || (x === 1 && y === 2 && z === 2)) {
        this.checkWinInLine(x, y, z, color, { x: -1, y: 1, z: 1}, player);
        this.checkWinInLine(x, y, z, color, { x: -1, y: 0, z: 1}, player);
        this.checkWinInLine(x, y, z, color, { x: 0, y: 1, z: 1}, player);
      } else if ((x === 1 && y === 2 && z === 1) || (x === 2 && y === 1 && z === 2)) {
        this.checkWinInLine(x, y, z, color, { x: 1, y: -1, z: 1}, player);
        this.checkWinInLine(x, y, z, color, { x: 0, y: -1, z: 1}, player);
        this.checkWinInLine(x, y, z, color, { x: 1, y: 0, z: 1}, player);
      } else if ((x === 2 && y === 2 && z === 1) || (x === 1 && y === 1 && z === 2)) {
        this.checkWinInLine(x, y, z, color, { x: -1, y: -1, z: 1}, player);
        this.checkWinInLine(x, y, z, color, { x: -1, y: 0, z: 1}, player);
        this.checkWinInLine(x, y, z, color, { x: 0, y: -1, z: 1}, player);
      } else if ((x === 1 || x === 2) && (y === 1 || y === 2) && x === y) {
        this.checkWinInLine(x, y, z, color, { x: 1, y: 1, z: 0}, player);
      } else if ((x === 1 || x === 2) && (y === 1 || y === 2) && x !== y) {
        this.checkWinInLine(x, y, z, color, { x: -1, y: 1, z: 0}, player);
      } else if ((z === 1 || z === 2) && (y === 1 || y === 2) && z !== y) {
        this.checkWinInLine(x, y, z, color, { x: 0, y: 1, z: -1}, player);
      } else if ((z === 1 || z === 2) && (y === 1 || y === 2) && z === y) {
        this.checkWinInLine(x, y, z, color, { x: 0, y: 1, z: 1}, player);
      } else if ((z === 1 || z === 2) && (x === 1 || x === 2) && z !== x) {
        this.checkWinInLine(x, y, z, color, { x: 1, y: 0, z: -1}, player);
      } else if ((z === 1 || z === 2) && (x === 1 || x === 2) && z === x) {
        this.checkWinInLine(x, y, z, color, { x: 1, y: 0, z: 1}, player);
      }
    }
  }
  checkWinInLine(xPosition, yPosition, zPosition, color, Vector, player?) {
    const V = Vector;
    let win = 0;
    for (let i = 0; i < 4; i++) {
      const z = (zPosition + (V.z * i)) % 4;
      const y = (yPosition + (V.y * i)) % 4;
      const x = (xPosition + (V.x * i)) % 4;
      if (this.table[z < 0 ? z + 4 : z][y < 0 ? y + 4 : y][x < 0 ? x + 4 : x].color === color) {
        win++;
      }
    }
    if (win === 3) {
      console.log('3!');
    } else if (win === 4) {
      this.victory(player);
      for (let i = 0; i < 4; i++) {
      const z = (zPosition + (V.z * i)) % 4;
      const y = (yPosition + (V.y * i)) % 4;
      const x = (xPosition + (V.x * i)) % 4;
      this.table[z < 0 ? z + 4 : z][y < 0 ? y + 4 : y][x < 0 ? x + 4 : x].isWonField = true;
      }
    }
  }
  addBall(data) {
      if (data.path[0].classList.contains('field') && this.activeGame) {
      const x = data.path[0].dataset.x;
      const y = data.path[0].dataset.y;
      const z = data.path[0].dataset.z;
      const field = this.table[z][y][x];
      if (field.isEmpty) {
        field.isEmpty = false;
        if (this.player1.isActive) {
          field.color = this.player1.color;
          this.checkWin(x, y, z, this.player1);
          this.changePlayer();
        } else {
          field.color = this.player2.color;
          this.checkWin(x, y, z, this.player2);
          this.changePlayer();
        }
        this.tableMoves.push(field);
        this.numbers++;
      } else {
        // console.log('zajete');
      }
    }
  }
}
