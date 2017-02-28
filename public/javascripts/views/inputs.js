namespace('Neat.Views')

Neat.Views.Inputs = class Inputs {
  constructor ({ el, model, game = true }) {
    this.el = el
    this.model = model
    this.game = game

    this.model.on('change', () => this.render())
  }

  template (cells) {
    return cells.reduce((html, cell) => {
      const attr = cell ? `block ${this.color(cell)}` : ''

      return html += `<div class="${attr}"></div>`
    }, '')
  }

  color (shape) {
    switch(shape) {
      case 'O': return 'red'
      case 'F': return 'orange'
      case 'L': return 'yellow'
      case 'S': return 'blue'
      case 'Z': return 'green'
      case 'I': return 'purple'
      case 'T': return 'pink'
      case -1: return 'black'
      case 1: return 'gray'
    }
  }

  render () {
    const model = this.game ? this.model.toJSON() : this.model.getInputs()

    this.el.innerHTML = this.template(model)
  }
}
