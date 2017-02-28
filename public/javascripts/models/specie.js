namespace('Neat.Models')

Neat.Models.Specie = class Specie {
  constructor ({ topFitness = 0, staleness = 0, genomes = [], averageFitness = 0 }) {
    this.topFitness = topFitness
    this.staleness = staleness
    this.genomes = genomes
    this.averageFitness = averageFitness
  }

  add (genome) {
    this.genomes.push(genome)
  }

  at (index) {
    return this.genomes[index]
  }

  sort () {
    this.genomes = this.genomes.sort((a, b) => a.fitness - b.fitness)

    return this
  }

  cullBottomHalf () {
    const half = Math.ceil(this.genomes.length / 2)

    this.cull(half)
  }

  cull (to = 1) {
    this.sort()

    while (this.genomes.length > to) {
      this.genomes.shift()
    }
  }

  calculateStaleness () {
    const genomes = this.genomes.sort((a, b) => b.fitness - a.fitness)

    if (genomes[0].fitness > this.topFitness) {
      this.topFitness = genomes[0].fitness
      this.staleness = 0
    } else {
      this.staleness++
    }
  }

  calculateAverageFitness () {
    const total = this.genomes.reduce((memo, genome) => memo += genome.globalRank, 0)

    this.averageFitness = total / this.genomes.length
  }

  breedChild () {
    let child = this.sample().copy()

    if (Math.random() < CROSSOVER_CHANCE) {
      child = this.crossover(this.sample(), this.sample())
    }

    child.mutate()

    return child
  }

  sample () {
    const randomIndex = Math.floor(Math.random() * this.genomes.length)

    return this.at(randomIndex)
  }

  crossover (g1, g2) {
    const [genome1, genome2] = [g1, g2].sort((a, b) => b.fitness - a.fitness)
    const maxNeuron = Math.max(genome1.maxNeuron, genome2.maxNeuron)
    const mutationRates = JSON.parse(JSON.stringify(g1.mutationRates))
    const innovations = genome2.genes.innovations()
    const genes = genome1.genes.map(gene1 => {
      const gene2 = innovations[gene1.innovation]
      const isCross = (gene2 && gene2.enabled && Math.floor(Math.random() * 2) === 1)

      return isCross ? gene2 : gene1
    })

    return new Neat.Models.Genome({
      maxNeuron,
      mutationRates,
      genes: new Neat.Models.Genes({ genes })
    })
  }

  toJSON () {
    return {

    }
  }
}
