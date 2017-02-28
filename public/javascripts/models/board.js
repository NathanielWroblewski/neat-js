namespace('Neat.Models')

const BLOCK = -1
const CURRENT = 1
const EMPTY_CELL = 0

Neat.Models.Board = class Board {
  constructor ({ height, width }) {
    this.score = 0
    this.board = Array(height * width).fill(EMPTY_CELL)
    this.piece = new Neat.Models.Piece()
    this.width = width
    this.height = height
    this.gameOver = false

    this.place(this.piece.toJSON())
    this._callbacks = {
      change: []
    }
  }

  place (indices) {
    indices.forEach(index => this.board[index] = this.piece.shape)
  }

  movePiece (direction) {
    if (this.gameOver) return false

    if (this.spaceAvailable(this.piece[direction](), this.piece.toJSON())) {
      this.remove(this.piece.toJSON())
      this.piece.update(this.piece[direction](), direction === 'rotate')
    } else if (direction === 'drop') {
      this.checkLines()
      this.newPiece()
    }

    this.place(this.piece.toJSON())
    this.trigger('change')
  }

  findLine () {
    for (let i = 0; i < this.board.length; i += this.width) {
      const row = this.board.slice(i, i + this.width)

      if (row.indexOf(EMPTY_CELL) < 0) {
        return row.map((cell, j) => i + j)
      }
    }
  }

  checkLines () {
    while (this.findLine()) {
      const line = this.findLine()

      this.score++
      this.remove(line)

      const blocksAboveLine = []

      for (let i = 0; i < line[0]; i++) {
        if (this.occupied(i)) blocksAboveLine.push(i)
      }

      for (let i = 0, len = blocksAboveLine.length; i < len; i++) {
        let previousIndex = blocksAboveLine[len - (i + 1)],
            previousValue = this.board[previousIndex]
        this.board[previousIndex] = EMPTY_CELL
        this.board[previousIndex + this.width] = previousValue
      }
    }
  }

  newPiece () {
    this.piece = new Neat.Models.Piece()
    if (!this.placeable(this.piece.toJSON())) this.endGame()
  }

  endGame () {
    this.gameOver = true
  }

  placeable (indices) {
    return !indices.find(index => this.occupied(index))
  }

  spaceAvailable (indices, current) {
    for (let i = 0; i < indices.length; i++) {
      let index = indices[i]
      if (index < 0 || index > this.width * this.height) return false
      if (this.occupied(index) && current.indexOf(index) < 0) return false
    }

    if (this.offBoard(indices)) return false

    if (this.lineTest(indices, current) || this.lineTest(current, indices)) return false

    return true
  }

  occupied (index) {
    return this.board[index] !== EMPTY_CELL
  }

  offBoard (indices) {
    let leftColumn = false,
        rightColumn = false;

    indices.forEach(index => {
      if (index % this.width === 0) leftColumn = true
      if (index % this.width === this.width - 1) rightColumn = true
    })

    return leftColumn && rightColumn
  }

  // ensures a vertical line will not pass from the left to the right
  lineTest (left, right) {
    let leftLine = true,
        rightLine = true

    left.forEach(index => {
      if (index % this.width !== 0) leftLine = false
    })

    right.forEach(index => {
      if (index % this.width !== this.width - 1) rightLine = false
    })

    return leftLine && rightLine
  }

  remove (indices) {
    indices.forEach(index => this.board[index] = EMPTY_CELL)
  }

  toJSON () {
    return this.board
  }

  getInputs () {
    return this.board.map((cell, index) => {
      if (this.piece.indices.indexOf(index) >= 0) {
        return CURRENT;
      } else if (cell) {
        return BLOCK
      } else {
        return EMPTY_CELL
      }
    })

  }

  trigger (eventName) {
    this._callbacks[eventName].forEach(callback => callback())
  }

  on (eventName, callback) {
    this._callbacks[eventName] = this._callbacks[eventName].concat(callback)
  }
}
