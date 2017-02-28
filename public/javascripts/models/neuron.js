namespace('Neat.Models')

Neat.Models.Neuron = class Neuron {
  constructor ({ incoming = [], value = 0.0 }) {
    this.incoming = incoming
    this.value = value
  }

  addIncoming (gene) {
    this.incoming.push(gene)
  }

  reduce (fn) {
    return this.incoming.reduce(fn, 0)
  }

  setValue (value) {
    this.value = value
  }
}
