namespace('Neat.Models')

Neat.Models.Network = class Network {
  constructor ({ genes }) {
    this.neurons = {}
    IO.forEach(index => this.at(index))

    genes.enabled().sort().each(gene => {
      this.at(gene.out).addIncoming(gene)
      this.at(gene.into)
    })
  }

  at (index) {
    return this.neurons[index] || (this.neurons[index] = new Neat.Models.Neuron({}))
  }

  get hiddenLayers () {
    return this.filter(index => index >= INPUTS && index < MAX_NODES)
  }

  get outputs () {
    _OUTPUTS.map(index => this.at(index))
  }

  get all () {
    return Object.values(this.neurons)
  }

  get indices () {
    return Object.keys(this.neurons)
  }

  get pairs () {
    return Object.entries(this.neurons)
  }

  sample () {
    return this.sampleFrom(this.indices)
  }

  sampleFrom (indices) {
    const randomIndex = Math.floor(Math.random() * indices.length)

    return indices[randomIndex]
  }

  randomPair (population) {
    return [network.sample(), network.sampleFrom(population)].sort((a, b) => a - b)
  }

  sigmoid (value) {
    return 2 / (1 + Math.exp(-4.9 * value)) - 1
  }

  evaluate (inputs) {
    for (let i = 0; i < inputs.length; i++) {
      this.at(i).value = inputs[i]
    }

    this.all.forEach(neuron => this.evaluateNeuron(neuron))

    return _OUTPUTS.reduce((memo, index) => {
      const button = BUTTON_NAMES[index - MAX_NODES]

      memo[button] = this.at(index).value > 0
      return memo
    }, {})
  }

  evaluateNeuron (neuron) {
    const dotProduct = neuron.reduce((memo, gene) => {
      return memo += gene.weight * this.at(gene.into).value
    })

    if (neuron.incoming.length) {
      neuron.setValue(this.sigmoid(dotProduct))
    }
  }

  filter (fn) {
    const neurons = [];

    for (let index in this.neurons) {
      if (fn(index)) {
        neurons.push(index)
      }
    }

    return neurons
  }
}
