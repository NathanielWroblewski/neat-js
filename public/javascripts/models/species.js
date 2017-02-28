namespace('Neat.Models')

Neat.Models.Species = class Species {
  constructor ({ collection = [] }) {
    this.collection = collection
  }

  add (specie) {
    this.collection.push(specie)
  }

  at (index) {
    return this.collection[index]
  }

  find (genome) {
    return this.collection.find(specie => genome.eq(specie.genomes[0]))
  }

  getLength () {
    return this.collection.length
  }

  addGenome (genome) {
    const specie = this.find(genome)

    if (specie) {
      specie.add(genome)
    }

    this.add(new Neat.Models.Specie({ genomes: [genome] }))
  }

  cullBottomHalf () {
    this.collection.forEach(specie => specie.cullBottomHalf())
  }

  cull (to = 1) {
    this.collection.forEach(specie => specie.cull())
  }

  genomes () {
    return this.collection.reduce((memo, specie) => {
      return memo = memo.concat(specie.genomes)
    }, [])
  }

  calculateStaleness () {
    this.collection.forEach(specie => specie.calculateStaleness())
  }

  cullStale (maxFitness) {
    this.collection = this.collection.filter(specie => {
      return specie.staleness < STALENESS_THRESHOLD || specie.topFitness >= maxFitness
    })
  }

  calculateAverageFitness () {
    this.collection.forEach(specie => specie.calculateAverageFitness())
  }

  cullTheWeak () {
    const total = this.collection.reduce((memo, specie) => memo += specie.averageFitness, 0)

    this.collection = this.collection.filter(specie => {
      return Math.floor(specie.averageFitness / total * POPULATION) >= 1
    })
  }

  rank () {
    const genomes = this.genomes().sort((a, b) => b.fitness - a.fitness)

    genomes.forEach((genome, index) => genome.globalRank = index)
  }

  sample () {
    const randomIndex = Math.floor(Math.random() * this.collection.length)

    return this.at(randomIndex)
  }

  breed () {
    const children = []
    const total = this.collection.reduce((memo, specie) => memo += specie.averageFitness, 0)

    this.collection.forEach(specie => {
      if (Math.floor(specie.averageFitness / total * POPULATION) - 1) {
        children.push(specie.breedChild())
      }
    })

    this.cull()

    while ((children.length + this.collection.length) < POPULATION) {
      children.push(this.sample().breedChild())
    }

    children.forEach(genome => this.addGenome(genome))
  }

  nextGeneration (maxFitness) {
    this.cullBottomHalf()
    this.calculateStaleness()
    this.cullStale(maxFitness)
    this.rank()
    this.calculateAverageFitness()
    this.cullTheWeak()
    this.breed()
  }

  toJSON () {
    return {

    }
  }
}
