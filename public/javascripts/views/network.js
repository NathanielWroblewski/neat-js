namespace('Neat.Views')

const WIDTHS = {
  container: 135,
  inputs: {
    width: 12,
    height: 12,
    per: 10,
    panel: 0,
    offset: 0
  },
  hidden: {
    width: 1,
    height: 1,
    per: 120,
    panel: 1,
    offset: INPUTS
  },
  outputs: {
    width: 100,
    height: 60,
    per: 1,
    panel: 2,
    offset: MAX_NODES
  }
}

Neat.Views.Network = class Network {
  constructor ({ el, model, game = true }) {
    this.el = el
    this.model = model
  }

  getSegment (index) {
    if (index < INPUTS) {
      return 'inputs'
    } else if (index >= MAX_NODES) {
      return 'outputs'
    } else {
      return 'hidden'
    }
  }

  getCoords (index) {
    const segment = this.getSegment(index)
    const { width, height, per, panel, offset } = WIDTHS[segment]
    const { container } = WIDTHS
    const i = index - offset
    const x = ((i % per) * width) + Math.floor(width / 2) + (panel * container)
    const y = (Math.floor(i / per) * height) + Math.floor(height / 2)

    return [x, y]
  }

  templateGene (gene) {
    const [x1, y1] = this.getCoords(gene.into)
    const [x2, y2] = this.getCoords(gene.out)

    return `<line class="enabled-${gene.enabled}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`
  }

  template (model) {
    const html = model.genes.reduce((memo, gene) => memo += this.templateGene(gene), '')

    return `<svg>${html}</svg>`
  }

  render () {
    this.el.innerHTML = this.template(this.model)
  }
}
