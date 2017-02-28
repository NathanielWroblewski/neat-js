namespace('Neat.Models')

Neat.Models.Genome = class Genome {
  constructor ({ genes = null, fitness = 0, adjustedFitness = 0, network = null, maxNeuron = 0, globalRank = 0, mutationRates = null, innovate }) {
    this.genes = genes || new Neat.Models.Genes([])
    this.fitness = fitness
    this.adjustedFitness = adjustedFitness
    this.network = network || new Neat.Models.Network({ genes: this.genes })
    this.maxNeuron = maxNeuron
    this.globalRank = globalRank
    this.mutationRates = mutationRates || JSON.parse(JSON.stringify(MUTATION_CHANCE))
    this.innovate = innovate || (() => null)
  }

  copy () {
    return new Genome(this.toJSON())
  }

  mutate () {
    const { link, bias, node, enable, disable } = this._mutateRates()
    this._pointMutate()
    this._attempt(link, () => this._linkMutate())
    this._attempt(bias, () => this._linkMutate(INPUTS))
    this._attempt(node, () => this._nodeMutate())
    this._attempt(node, () => this._toggleMutate(this.genes.enabled()))
    this._attempt(node, () => this._toggleMutate(this.genes.disabled()))
  }

  _attempt (chance, mutation) {
    for (let i = chance; i > 0; i--) {
      if (Math.random() < i) {
        mutation()
      }
    }
  }

  _mutateRates () {
    for (let mutation in this.mutationRates) {
      const rate = Math.floor(Math.random() * 2) ? 0.95 : 1.05263

      this.mutationRates[mutation] = rate * this.mutationRates[mutation]
    }

    return this.mutationRates
  }

  _pointMutate () {
    const { connections, step } = this.mutationRates

    if (Math.random() < connections) {
      this.genes.each(gene => gene.mutate(step))
    }
  }

  _linkMutate (forceBias) {
    const io = this.genes.io().filter(index => index > INPUTS)
    const network = new Neat.Models.Network({ genes: this.genes })
    const [into, out] = [forceBias || network.sample(), network.sampleFrom(io)].sort((a, b) => a - b)

    if (!this.genes.containsLink(into, out)) {
      this.genes.add(new Neat.Models.Gene({
        into,
        out,
        innovation: this.innovate(),
        weight: Math.random() * 4 - 2
      }))
    }
  }

  increment () {
    return ++this.maxNeuron
  }

  _nodeMutate () {
    const gene = this.genes.sample()

    if (gene.enabled) {
      this.genes.concat(gene.split(this.maxNeuron, this.innovate))
    }
  }

  _toggleMutate (genes) {
    if (genes.getLength()) {
      genes.sample().toggle()
    }
  }

  eq (genome) {
    const dd = DELTA_DISJOINT * this.genes.disjoint(genome.genes)
    const dw = DELTA_WEIGHTS * this.genes.weights(genome.genes)

    return dd + dw < DELTA_THRESHOLD
  }

  evaluate (inputs) {
    this.network = new Neat.Models.Network({ genes: this.genes })

    return this.network.evaluate(inputs)
  }

  toJSON () {
    return {
      genes: this.genes,
      fitness: this.fitness,
      adjustedFitness: this.adjustedFitness,
      network: this.network,
      maxNeuron: this.maxNeuron,
      globalRank: this.globalRank,
      mutationRates: this.mutationRates
    }
  }

  static basic () {
    const model = new this({ maxNeuron: INPUTS - 1 })

    model.mutate()

    return model
  }
}
