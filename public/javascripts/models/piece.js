namespace('Neat.Models')

const SHAPES = ['O', 'S', 'Z', 'L', 'F', 'T', 'I']
const PIECES = {
  O: [4,  5, 14, 15],
  S: [4,  5, 13, 14],
  Z: [4,  5, 15, 16],
  L: [4, 14, 24, 25],
  F: [4,  5, 14, 24],
  T: [4, 14, 24, 15],
  I: [4, 14, 24, 34]
}

const ORIENTATIONS = {
  O: [[ 0,  1, 10, 11], [ 0,  1, 10, 11], [ 0,  1, 10, 11], [ 0,  1, 10, 11]],
  S: [[-1,  9, 10, 20], [ 1,  2, 10, 11], [-1,  9, 10, 20], [ 1,  2, 10, 11]],
  Z: [[ 1, 10, 11, 20], [-1,  0, 10, 11], [ 1, 10, 11, 20], [-1,  0, 10, 11]],
  L: [[10, 11, 12, 20], [-9,  1, 11, 12], [ 1,  9, 10, 11], [-2, -1,  9, 19]],
  F: [[ 9, 10, 11, 21], [-9, -8,  1, 11], [-1,  9, 10, 11], [1,  11, 20, 21]],
  T: [[ 0,  9, 10, 11], [ 0, 10, 11, 20], [ 9, 10, 11, 20], [-9,  0,  1, 11]],
  I: [[ 9, 10, 11, 12], [-9,  1, 11, 21], [ 9, 10, 11, 12], [-9,  1, 11, 21]]
}

Neat.Models.Piece = class Piece {
  constructor () {
    const randomIndex = Math.floor(Math.random() * SHAPES.length)

    this.orientation = 1
    this.shape   = SHAPES[randomIndex]
    this.indices = PIECES[this.shape]
  }

  drop () {
    return this._move(10)
  }

  left () {
    return this._move(-1)
  }

  right () {
    return this._move(1)
  }

  rotate () {
    const deltas = ORIENTATIONS[this.shape][(this.orientation + 1) % 4]

    return deltas.map(delta => this.indices[0] + delta)
  }

  _move (change) {
    return this.indices.map(index => index + change)
  }

  update (indices, orientation) {
    this.indices = indices
    if (orientation) this.orientation++
  }

  toJSON () {
    return this.indices
  }
}
